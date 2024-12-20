<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Voucher;  // Nếu cần truyền dữ liệu từ Voucher model
use Illuminate\Contracts\Queue\ShouldQueue;

class VoucherMail  extends Mailable
{
    use SerializesModels;

    public $voucher;
    public $voucherUrl;

    /**
     * Tạo một instance mới của lớp VoucherMail.
     *
     * @param  Voucher  $voucher
     * @param  string  $voucherUrl
     * @return void
     */
    public function __construct(Voucher $voucher, $voucherUrl)
    {
        $this->voucher = $voucher;
        $this->voucherUrl = $voucherUrl;
    }

    /**
     * Xây dựng nội dung email.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Chúc Mừng Bạn! Bạn đã nhận được voucher!')
                    ->view('emails.voucher'); // Đường dẫn đến view email
    }
}
