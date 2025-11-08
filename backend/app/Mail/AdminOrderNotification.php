<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class AdminOrderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $orderItems;
    public $gstNumber;
    public $pdfContent;
    public $pdfFilename;

    /**
     * Create a new message instance.
     */
    public function __construct($order, $orderItems, $gstNumber = null, $pdfContent = null, $pdfFilename = null)
    {
        $this->order = $order;
        $this->orderItems = $orderItems;
        $this->gstNumber = $gstNumber;
        $this->pdfContent = $pdfContent;
        $this->pdfFilename = $pdfFilename;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Order Received - Floretta India #' . $this->order->razorpay_order_id,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-order-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if ($this->pdfContent && $this->pdfFilename) {
            return [
                Attachment::fromData(fn () => $this->pdfContent, $this->pdfFilename)
                    ->withMime('application/pdf'),
            ];
        }

        return [];
    }
}
