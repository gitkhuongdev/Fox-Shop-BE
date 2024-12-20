<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Voucher; 
use Illuminate\Contracts\Queue\ShouldQueue;

class VoucherMail  extends Mailable
{
    use SerializesModels;

    public $data;

    /**
     * Tạo một instance mới của lớp VoucherMail.
     *
     * @param  Voucher  $data
     * @return void
     */
    public function __construct(Voucher $data)
    {
        $this->data = $data;
    }

    /**
     * Xây dựng nội dung email.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.voucher')->with(['data' => $this->data]);;
    }
}
