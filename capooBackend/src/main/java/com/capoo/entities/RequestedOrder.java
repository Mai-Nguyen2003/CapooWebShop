package com.capoo.entities;
import java.util.*;

public class RequestedOrder {
    private String userName;
    private String email;
    List<OrderedItem> items;

    public RequestedOrder(){}

    public RequestedOrder(String userName, String email, List<OrderedItem> items) {
        this.userName = userName;
        this.email = email;
        this.items = items;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public List<OrderedItem> getItems() {
        return items;
    }
}
