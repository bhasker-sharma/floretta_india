<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\HotelAmenities\Contact as AmenitiesContact;

class ContactEnquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    public AmenitiesContact $contact;

    /**
     * Create a new message instance.
     */
    public function __construct(AmenitiesContact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $hotel = $this->contact->hotel_name ?: 'Unknown Hotel';
        return new Envelope(
            subject: 'New Hotel Amenities Enquiry - ' . $hotel,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-enquiry-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
