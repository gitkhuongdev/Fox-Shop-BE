<?php

namespace App\Http\Controllers;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected $model;
    public function __construct(Review $model)
    {
        $this->model = Review::class;
    }

    public function index()
    {
        $review = Review::all();
        $product = Review::with(['product.gallery'])->get();
        $productArr = $product->toArray();
        return Inertia::render("Reviews/Index",["review"=>$review,"product"=>$productArr]);
    }


    public function checkIfUserHasCommented(Request $request)
    {
        $userId = $request->query('userId');
        $productId = $request->query('productId');

        $hasCommented = Review::where('id_user', $userId)
                               ->where('id_product', $productId)
                               ->where('status', 1)
                               ->exists();
    
        return response()->json(['hasCommented' => $hasCommented]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_product' => 'required|exists:products,id',
            'id_user' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        Review::create($validated);

        return response()->json(['check' => true]);
    }
    public function switchReview(Request $request, $id){
        $review = $this->model::find($id);
        $review->status = ($review->status === 1) ? 0 : 1;
        $review->save();
        return response()->json(['check' => true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // 
    public function getAllComments(Request $request)
    {
        $comments = Review::latest('created_at')
        ->where('status', 1)
        ->orderBy('created_at')
        ->get(); 
        return response()->json($comments);
    }
}
