<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use App\Models\NotifyList;
use Illuminate\Http\Request;

class AdminEnquiryController extends Controller
{
    public function index(Request $r)
    {
        $q = ContactEnquiry::orderByDesc('created_at');
        if ($r->status) $q->where('status', $r->status);
        return response()->json($q->paginate(20));
    }

    public function updateStatus(Request $r, $id)
    {
        $enquiry = ContactEnquiry::findOrFail($id);
        $enquiry->update(['status' => $r->status]);
        return response()->json($enquiry->fresh());
    }

    public function notifyList()
    {
        return response()->json(NotifyList::orderByDesc('created_at')->get());
    }
}