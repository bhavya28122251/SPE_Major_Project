package com.pm.billingservice.grpc;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GrpcService
public class BillingGrpcService extends BillingServiceGrpc.BillingServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(BillingGrpcService.class);

    //createBillingAccount is a fun def in BillingServiceImplBase(proto) which we override here.
    //Here we are using StreamObserver for continous communication between client and server.
    @Override
    public void createBillingAccount(BillingRequest billingRequest,
                                     StreamObserver<BillingResponse> responseObserver){

        log.info("createBillingAccount request received {}",billingRequest.toString());


        //Write Businnes logic here like saving to Database, performing Calculations.

        BillingResponse response=BillingResponse.newBuilder()
                .setAccountId("12345")
                .setStatus("ACTIVE")
                .build();

        //We can write multipe onNext() to send multiple reponse
        responseObserver.onNext(response);

        //OnCompleted means we want to end this cycle of response
        responseObserver.onCompleted();
    }

}

