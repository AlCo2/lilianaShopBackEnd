<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use App\Models\Message;
use App\Models\Order;
use App\Models\Order_detail;
use App\Models\Order_item;

class DashboardController extends Controller
{
    public function overview(){
        $products = Product::limit(5)->with('category')->get();
        $total_products = Product::count();
        $total_sales = 0;
        $order_item = Order_item::with('order')->get();
        $total_orders = Order::count();
        foreach ($order_item as $order)
        {
            if ($order->order->status_id === 2)
                $total_sales += $order->total;
        }
        return Inertia::render('dashboard/page', compact('products', 'total_sales', 'total_products', 'total_orders'));
    }

    public function customer(){
        $customers = User::all();
        return Inertia::render('dashboard/customer/page', compact('customers'));
    }

    public function category(){
        $categories = Category::all();
        return Inertia::render('dashboard/category/page', compact('categories'));
    }

    public function product(){
        $products = Product::with('category', 'images')->get();
        $categories = Category::all();
        return Inertia::render('dashboard/product/page', compact('products', 'categories'));
    }

    public function order(){
        $order = Order::with('order_detail')->get();
        return Inertia::render('dashboard/order/page', compact('order'));
    }

    public function promotion(){
        $products = Product::whereDoesntHave('promotion')->get();
        $promotions = Promotion::with('product')->get();
        return Inertia::render('dashboard/promotion/page', compact('products', 'promotions'));
    }

    public function message(){
        $messages = Message::get();
        return Inertia::render('dashboard/message/page', compact('messages'));
    }
}
