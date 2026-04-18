package com.capoo.function;
import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.capoo.entities.*;
import com.azure.communication.email.*;
import com.azure.communication.email.models.*;
import com.azure.core.util.polling.PollResponse;
import com.azure.core.util.polling.SyncPoller;


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

        double totalPrice = orderedItems.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
        StringBuilder sb = new StringBuilder();
        sb.append("Hi " + userName + ", your order at Capoo Shop has been successfully placed.\n").append("Items:\n");
        for(OrderedItem item : orderedItems){
            sb.append(String.format("- %d x %s, %f\n",item.getQuantity(),item.getTitle(), item.getPrice()));
        }
        sb.append(String.format("Total Price: %.2f", totalPrice));

        String connectionString = System.getenv("EMAIL_SERVICE_CONNECTION_STRING");
        EmailClient emailClient = new EmailClientBuilder().connectionString(connectionString).buildClient();
        EmailAddress toAddress = new EmailAddress(email);
        

        EmailMessage emailMessage = new EmailMessage()
            .setSenderAddress("DoNotReply@d9ddba7c-f25b-47ef-978f-719015bbade3.azurecomm.net")
            .setToRecipients(toAddress)
            .setSubject("Your Order Confirmation")
            .setBodyPlainText(sb.toString());
        SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(emailMessage, null);
        PollResponse<EmailSendResult> emailResult = poller.waitForCompletion();  

        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(requestedOrder)
                        .build();
}    
}
}
                      

