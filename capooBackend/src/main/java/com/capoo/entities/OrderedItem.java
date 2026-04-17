package com.capoo.entities;

public class OrderedItem{
    private int id;
    private String title;
    private double price;
    private String image;
    private int quantity;

    public OrderedItem(){};

    public OrderedItem(int id, String title, double price, String image, int quantity){
        this.id = id;
        this.title =title;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public double getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}