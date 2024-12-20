<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table = 'payment';

    protected $fillable = [
        'method'
    ];
    public function orders()
    {
        return $this->hasMany(Orders::class, 'id_payment', 'id');
    }
}
