<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PincodeController extends Controller
{
    private array $expressZones = ['302','303','201','110','400','411','560','600','700'];

    public function check(Request $r)
    {
        $pincode = $r->input('pincode', '');
        if (!preg_match('/^\d{6}$/', $pincode)) {
            return response()->json(['serviceable' => false, 'message' => 'Invalid pincode.'], 422);
        }

        $prefix = substr($pincode, 0, 3);
        $days   = in_array($prefix, $this->expressZones) ? '3-4' : '5-7';

        return response()->json([
            'serviceable'    => true,
            'estimated_days' => $days,
            'message'        => "Delivery in {$days} business days",
        ]);
    }
}