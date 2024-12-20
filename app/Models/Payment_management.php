<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment_management extends Model
{
    use HasFactory;
    protected $table = 'payment_management';

    protected $fillable = [
        'user_id',
        'order_id',
        'money',
        'note',
        'response_code',
        'code_vnpay',
        'code_bank',
        'date_bank'
    ];
}
