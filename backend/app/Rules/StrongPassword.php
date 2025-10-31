<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * Strong password requirements:
     * - Minimum 8 characters
     * - At least one uppercase letter (A-Z)
     * - At least one lowercase letter (a-z)
     * - At least one number (0-9)
     * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check minimum length
        if (strlen($value) < 8) {
            $fail('The :attribute must be at least 8 characters long.');
            return;
        }

        // Check for at least one uppercase letter
        if (!preg_match('/[A-Z]/', $value)) {
            $fail('The :attribute must contain at least one uppercase letter.');
            return;
        }

        // Check for at least one lowercase letter
        if (!preg_match('/[a-z]/', $value)) {
            $fail('The :attribute must contain at least one lowercase letter.');
            return;
        }

        // Check for at least one number
        if (!preg_match('/[0-9]/', $value)) {
            $fail('The :attribute must contain at least one number.');
            return;
        }

        // Check for at least one special character
        if (!preg_match('/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/', $value)) {
            $fail('The :attribute must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?).');
            return;
        }

        // Check for common weak passwords
        $weakPasswords = [
            'password', 'password1', 'password123', '12345678', 'qwerty123',
            'abc123456', 'password!', 'passw0rd', 'letmein1', 'welcome1',
            'admin123', 'admin@123', 'test1234', 'user1234'
        ];

        if (in_array(strtolower($value), $weakPasswords)) {
            $fail('The :attribute is too common. Please choose a more secure password.');
            return;
        }
    }
}
