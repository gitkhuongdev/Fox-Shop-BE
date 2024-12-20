<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment_management extends Model
{
    use HasFactory;
    protected $table = 'payment_management';

    protected $fillable = [
        'method'
    ];
}
