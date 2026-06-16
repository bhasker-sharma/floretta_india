<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\PasswordResetOtp;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct(private MailService $mail) {}

    public function register(Request $r)
    {
        $v = Validator::make($r->all(), [
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'phone'    => 'required|string|max:15',
            'password' => 'required|min:8',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $otp     = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $user    = User::create([
            'name'           => $r->name,
            'email'          => $r->email,
            'phone'          => $r->phone,
            'password'       => Hash::make($r->password),
            'otp'            => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        try { $this->mail->sendOtpEmail($user, $otp); } catch (\Exception $e) {}

        return response()->json(['message' => 'Registration successful. Please verify your email.'], 201);
    }

    public function verifyEmail(Request $r)
    {
        $v = Validator::make($r->all(), ['email' => 'required|email', 'otp' => 'required|string|size:6']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::where('email', $r->email)->first();
        if (!$user) return response()->json(['message' => 'User not found.'], 404);
        if ($user->email_verified_at) return response()->json(['message' => 'Email already verified.'], 400);
        if ($user->otp !== $r->otp) return response()->json(['message' => 'Invalid OTP.'], 422);
        if (now()->isAfter($user->otp_expires_at)) return response()->json(['message' => 'OTP expired.'], 422);

        $user->update(['email_verified_at' => now(), 'otp' => null, 'otp_expires_at' => null]);
        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token, 'user' => $user->load('addresses')]);
    }

    public function resendOtp(Request $r)
    {
        $user = User::where('email', $r->email)->first();
        if (!$user) return response()->json(['message' => 'User not found.'], 404);
        if ($user->email_verified_at) return response()->json(['message' => 'Already verified.'], 400);

        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update(['otp' => $otp, 'otp_expires_at' => now()->addMinutes(10)]);

        try { $this->mail->sendOtpEmail($user, $otp); } catch (\Exception $e) {}

        return response()->json(['message' => 'OTP resent.']);
    }

    public function login(Request $r)
    {
        $v = Validator::make($r->all(), ['email' => 'required|email', 'password' => 'required']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::where('email', $r->email)->first();
        if (!$user || !Hash::check($r->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }
        if (!$user->email_verified_at) {
            return response()->json(['message' => 'Please verify your email first.', 'unverified' => true], 403);
        }

        $token = JWTAuth::fromUser($user);
        return response()->json(['token' => $token, 'user' => $user->load('addresses')]);
    }

    public function me()
    {
        return response()->json(auth()->user()->load('addresses'));
    }

    public function update(Request $r)
    {
        $user = auth()->user();
        $v = Validator::make($r->all(), ['name' => 'sometimes|string|max:100', 'phone' => 'sometimes|string|max:15']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user->update($r->only(['name', 'phone']));
        return response()->json($user->fresh());
    }

    public function changePassword(Request $r)
    {
        $v = Validator::make($r->all(), [
            'current_password' => 'required',
            'new_password'     => 'required|min:8',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = auth()->user();
        if (!Hash::check($r->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }
        $user->update(['password' => Hash::make($r->new_password)]);
        return response()->json(['message' => 'Password updated.']);
    }

    public function forgotPassword(Request $r)
    {
        $user = User::where('email', $r->email)->first();
        if (!$user) return response()->json(['message' => 'If this email exists, an OTP has been sent.']);

        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        \App\Models\PasswordResetOtp::updateOrCreate(
            ['email' => $r->email],
            ['otp' => $otp, 'expires_at' => now()->addMinutes(10)]
        );
        try { $this->mail->sendPasswordResetOtp($r->email, $otp); } catch (\Exception $e) {}

        return response()->json(['message' => 'If this email exists, an OTP has been sent.']);
    }

    public function verifyResetOtp(Request $r)
    {
        $record = \App\Models\PasswordResetOtp::where('email', $r->email)->where('otp', $r->otp)->first();
        if (!$record || now()->isAfter($record->expires_at)) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }
        $resetToken = \Illuminate\Support\Str::random(40);
        $record->update(['otp' => $resetToken, 'expires_at' => now()->addMinutes(15)]);
        return response()->json(['reset_token' => $resetToken]);
    }

    public function resetPassword(Request $r)
    {
        $v = Validator::make($r->all(), ['reset_token' => 'required', 'password' => 'required|min:8']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $record = \App\Models\PasswordResetOtp::where('otp', $r->reset_token)->first();
        if (!$record || now()->isAfter($record->expires_at)) {
            return response()->json(['message' => 'Invalid or expired reset token.'], 422);
        }

        $user = User::where('email', $record->email)->first();
        if (!$user) return response()->json(['message' => 'User not found.'], 404);

        $user->update(['password' => Hash::make($r->password)]);
        $record->delete();

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out.']);
    }

    public function addAddress(Request $r)
    {
        $v = Validator::make($r->all(), [
            'label'  => 'required|string',
            'name'   => 'required|string',
            'phone'  => 'required|string|max:15',
            'line1'  => 'required|string',
            'city'   => 'required|string',
            'state'  => 'required|string',
            'pincode'=> 'required|string|max:10',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = auth()->user();
        if ($r->boolean('is_default')) {
            UserAddress::where('user_id', $user->id)->update(['is_default' => false]);
        }
        $address = UserAddress::create(array_merge($r->all(), ['user_id' => $user->id]));
        return response()->json($address, 201);
    }

    public function updateAddress(Request $r, $id)
    {
        $address = UserAddress::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        if ($r->boolean('is_default')) {
            UserAddress::where('user_id', auth()->id())->update(['is_default' => false]);
        }
        $address->update($r->all());
        return response()->json($address->fresh());
    }

    public function deleteAddress($id)
    {
        UserAddress::where('id', $id)->where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Address deleted.']);
    }
}