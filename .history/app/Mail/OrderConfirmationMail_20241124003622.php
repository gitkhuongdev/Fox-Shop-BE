<?php

namespace App\Mail;

use App\Models\Orders;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    /**
     * Create a new message instance.
     *
     * @param Orders $order
     * @return void
     */
    public function __construct(Orders $order)
    {
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.order_confirmation') // Đường dẫn đến view email
                    ->subject('Đơn hàng của bạn đã được xác nhận') // Tiêu đề email
                    ->with([
                        'order' => $this->order, // Truyền dữ liệu order vào view
                    ]);
    }
}
