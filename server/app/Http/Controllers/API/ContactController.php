<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use App\Models\NotifyList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $r)
    {
        $v = Validator::make($r->all(), [
            'name'    => 'required|string|max:100',
            'email'   => 'required|email',
            'subject' => 'required|string|max:100',
            'message' => 'required|string',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        ContactEnquiry::create($r->only(['name','email','phone','subject','message']));
        return response()->json(['message' => 'Message received. We\'ll get back to you shortly.'], 201);
    }

    public function notify(Request $r)
    {
        $v = Validator::make($r->all(), ['email' => 'required|email']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        NotifyList::firstOrCreate(['email' => $r->email], ['source' => $r->input('source', 'coming_soon')]);
        return response()->json(['message' => 'You\'re on the list.'], 201);
    }
}