<?php
namespace App\Mail;

use App\Models\Voucher;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VoucherMail extends Mailable
{
    use Queueable, SerializesModels;

    public $voucher;

    // Constructor nhận đối tượng Voucher
    public function __construct(Voucher $voucher)
    {
        $this->voucher = $voucher;
    }

    // Xây dựng nội dung của email
    public function build()
    {
        return $this->view('emails.voucher') // Tạo view email trong resources/views/emails/voucher.blade.php
                    ->with([
                        'voucher' => $this->voucher,
                    ]);
    }
}
