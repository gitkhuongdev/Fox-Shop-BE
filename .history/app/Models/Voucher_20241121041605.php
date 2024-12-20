<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;
    protected $table = 'vouchers';
    protected $primaryKey = 'id';
    protected $fillable = [
        'code', 
        'discount_type', 
        'discount_value',
        'start_date',
        'end_date',
        'usage_limit',
        'minimum_monney',
        'status'
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vouchers', 'voucher_id', 'user_id');
    }
}
