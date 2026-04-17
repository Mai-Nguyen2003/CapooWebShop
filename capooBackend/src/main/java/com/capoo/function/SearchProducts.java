package com.capoo.function;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

import com.capoo.entities.Product;
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;


public class SearchProducts {
    private Connection sqlConn() throws Exception{
        String connectionUrl = System.getenv("SqlConnectionString");
        return  DriverManager.getConnection(connectionUrl);
    }
        @FunctionName("search")
        public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET}, 
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        List<Product> productList = new ArrayList<>();
        String inputTitle = request.getQueryParameters().getOrDefault("input", "");
        
        try{
            Connection conn = sqlConn();
            String sql = "SELECT * FROM products";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()){
                Product product = new Product( rs.getInt("id"),rs.getString("title"),rs.getString("description"),rs.getDouble("price"),rs.getString("image"));
                productList.add(product);
        }
            conn.close();
        }
        
        catch (Exception e){
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR).body("Error" + e.getMessage()).build();
        }
        if (!inputTitle.isEmpty()){
            productList = productList.stream().filter(p -> p.getTitle().contains(inputTitle)).toList();
        }
        
        return request.createResponseBuilder(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body(productList).build();
    }
    
}
