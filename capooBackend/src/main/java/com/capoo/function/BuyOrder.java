package com.capoo.function;
import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.capoo.entities.*;



public class BuyOrder {
    @FunctionName("buy")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<RequestedOrder>> request,
            final ExecutionContext context) {
        if (!request.getBody().isPresent()) {
        return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                        .body("No requested order.")
                        .build();
    } 
    else {
        final RequestedOrder requestedOrder = request.getBody().get();
        String email = requestedOrder.getEmail();
        String userName = requestedOrder.getUserName();
        List<OrderedItem> orderedItems = requestedOrder.getItems();
        if (email.isEmpty() || userName.isEmpty()){
              return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                        .body("User donot add their info")
                        .build();  
        }
        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(requestedOrder)
                        .build();
        
    }
}    
}
                      

