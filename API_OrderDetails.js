const express = require('express');
const app = express();
const port = 3000;



app.get('/api/orderDetails', (req, res) => {
      const orderCreateRS = require('C:/Users/ashuk/Downloads/responseordercreate.json');
    //  const orderCreateRS = require('C:/Users/ashuk/Downloads/OrderCreateRS.json')
    // const orderCreateRS = require('C:/Users/ashuk/Downloads/Createorderres12OCT.json')

    res.json(orderDetails(orderCreateRS));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function orderDetails(orderCreateRS) {
   
        const data = orderCreateRS.data.Response


        // Passengers
        const passengerData = data.Passengers?.Passenger?.[0];
        const birthdateString = passengerData?.Age?.BirthDate?.value || "";
        const birthdate = new Date(birthdateString);


        // Calculate the age by subtracting the birthdate from the current date
        const currentDate = new Date();
        const ageInMilliseconds = currentDate - birthdate;
        const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));


        const CommuterDetails = {
            "ObjectKey": passengerData?.ObjectKey,
            "Gender": passengerData?.Gender?.value,
            "PTCValue": passengerData?.PTC?.value,
            "Age": ageInYears || 0,
            "BirthDate": birthdateString,
            "GivenName": passengerData?.Name?.Given?.[0]?.value || "",
            "Title": passengerData?.Name?.Title || "",
            "Surname": passengerData?.Name?.Surname?.value || "",
            "EmailAddress": passengerData?.Contacts?.Contact?.[0]?.EmailContact?.Address?.value || "",
            "PhoneNumber": passengerData?.Contacts?.Contact?.[0]?.PhoneContact?.Number?.[0]?.value || "",
            "AddressStreet": passengerData?.Contacts?.Contact?.[0]?.AddressContact?.Street || "",
            "AddressPostalCode": passengerData?.Contacts?.Contact?.[0]?.AddressContact?.PostalCode || "",
            "AddressCityName": passengerData?.Contacts?.Contact?.[0]?.AddressContact?.CityName || "",
            "AddressCountryCode": passengerData?.Contacts?.Contact?.[0]?.AddressContact?.CountryCode?.value || "",
            "ContactRefuseInd": passengerData?.Contacts?.Contact?.[0]?.ContactRefuseInd || false,
            "EmployerSalesTaxRegistrationId": passengerData?.Employer?.SalesTaxRegistration?.SalesTaxRegistrationId || "",
            "EmployerName": passengerData?.Employer?.Name || "",
            "CommuterDocumentCountryOfResidence": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.CountryOfResidence || "",
            "CommuterDocumentType": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.Type || "",
            "CommuterDocumentDateOfIssue": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.DateOfIssue || "",
            "CommuterDocumentID": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.ID || "",
            "CommuterDocumentDateOfExpiration": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.DateOfExpiration || "",
            "CommuterDocumentCountryOfIssuance": passengerData?.PassengerIDInfo?.PassengerDocument?.[0]?.CountryOfIssuance || "",
            "FQTVAirlineID": passengerData?.FQTVs?.TravelerFQTV_Information?.[0]?.AirlineID?.value || "",
            "FQTVAccount": passengerData?.FQTVs?.TravelerFQTV_Information?.[0]?.Account || "",
            "FQTVNumber": passengerData?.FQTVs?.TravelerFQTV_Information?.[0]?.Number?.[0]?.value || ""
        };

        // Order Details
        const totalOrderPrice = data.Order?.[0]?.TotalOrderPrice?.SimpleCurrencyPrice?.value;
        const currencyCode = data.Order?.[0]?.TotalOrderPrice?.SimpleCurrencyPrice?.Code;
        const orderItem = data.Order[0].OrderItems.OrderItem?.[0];
        const flightItem = orderItem?.FlightItem;
        const originDest = flightItem?.OriginDestination?.[0]?.Flight?.[0];
        const orderItemAssociations = orderItem?.Associations;
        const disclosure = orderItem?.Disclosures?.Description?.[0];

        const bookingReferencesData = data.Order?.[0]?.BookingReferences?.BookingReference?.[0];
        //Seat Number 
        const rowNumber = (orderItem?.SeatItem?.Location?.Row?.Number[0]?.value || "");
        const column = (orderItem?.SeatItem?.Location?.Column || "");
        const SeatNumber = rowNumber + " " + column || "";


        const orderDetails = {
            "TotalOrderPrice": totalOrderPrice,
            "CurrencyCode": currencyCode,
            "OrderID": (data.Order?.[0]?.OrderID),
            "BookingReferenceID": bookingReferencesData?.ID || "",
            "BookingReferenceOtherIDName": bookingReferencesData?.OtherID?.Name || "",
            "BookingReferenceOtherIDValue": bookingReferencesData?.OtherID?.value || ""

        };
        // OrderItem remaining 
        const orderItemObject = {
            "SeatLPrice": orderItem?.SeatItem?.Price.Total.value || "",
            "SeatLPriceCode": orderItem?.SeatItem?.Price.Total.Code || "",
            "SeatAssociation": orderItem?.SeatItem?.SeatAssociation || "",
            "SeatNumber": SeatNumber,
            "OrderItemID": orderItem?.OrderItemID?.value,
            "OrderItemOwner": orderItem?.OrderItemID?.Owner,
            "BaseAmountValue": flightItem?.Price?.BaseAmount?.value,
            "BaseAmountCode": flightItem?.Price?.BaseAmount?.Code,
            "TotalTaxesValue": flightItem?.Price?.Taxes?.Total?.value,
            "TotalTaxesCode": flightItem?.Price?.Taxes?.Total?.Code,
            "TotalFeesValue": flightItem?.Price?.Fees?.Total?.value,
            "TotalFeesCode": flightItem?.Price?.Fees?.Total?.Code,
        };
        //FlightDetails_with_Reference_of_Order
        const flights = data.Order[0]?.OrderItems?.OrderItem[0]?.FlightItem?.OriginDestination[0]?.Flight || [];

        const order_flight_ItemsDetails = flights.map((flight, index) => {
            const segmentKey = flight?.SegmentKey || `Segment${index + 1}`;
            const departure = flight?.Departure || {};
            const arrival = flight?.Arrival || {};
            const marketingCarrier = flight?.MarketingCarrier || {};
            const equipment = flight?.Equipment || {};
            const classOfService = flight?.ClassOfService || {};
            const details = flight?.Details || {};

            return {
                SegmentKey: segmentKey,
                Departure: {
                    AirportCode: departure?.AirportCode?.value || "",
                    Date: departure?.Date || "",
                    Time: departure?.Time || "",
                    AirportName: departure?.AirportName || "",
                    Terminal: departure?.Terminal?.Name || "",
                },
                Arrival: {
                    AirportCode: arrival?.AirportCode?.value || "",
                    Date: arrival?.Date || "",
                    Time: arrival?.Time || "",
                    AirportName: arrival?.AirportName || "",
                    Terminal: arrival?.Terminal?.Name || "",
                },
                MarketingCarrier: {
                    AirlineID: marketingCarrier?.AirlineID?.value || "",
                    Name: marketingCarrier?.Name || "",
                    FlightNumber: marketingCarrier?.FlightNumber?.value || "",
                },
                Equipment: {
                    Name: equipment?.Name || "",
                    AircraftCode: equipment?.AircraftCode?.value || "",
                },
                ClassOfService: {
                    Code: classOfService?.Code?.value || "",
                    MarketingName: classOfService?.MarketingName?.value || "",
                    CabinDesignator: classOfService?.MarketingName?.CabinDesignator || "",
                },
                Details: {
                    FlightSegmentType: details?.FlightSegmentType?.Code || "",
                    FlightDistance: details?.FlightDistance?.Value.toString() || "",
                    FlightDuration: details?.FlightDuration?.Value || "",
                    Stops: details?.Stops?.StopQuantity || "",
                },
            };
        });

        //Flight Details
        let flightSegmentLevel; // Gives Info about Stops
        const flightSegment = data.DataLists?.FlightSegmentList?.FlightSegment || "";
        const numSegments = flightSegment.length;

        switch (numSegments) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                flightSegmentLevel = `${numSegments - 1}-Stop`;
                break;
            default:
                flightSegmentLevel = 'Non-Stop';
                break;
        }


        //Flight Segment Details

        const flightSegmentDetails = [];

        for (let i = 0; i < flightSegment.length; i++) {
            const segment = flightSegment[i];

            // Extract relevant information from each FlightSegment
            const departureAirportCode = segment.Departure?.AirportCode?.value || " ";
            const departureTerminal = segment.Departure?.Terminal?.Name || " ";
            const departureDate = segment.Departure?.Date || " ";
            const departureTime = segment.Departure?.Time || " ";

            const arrivalAirportCode = segment.Arrival?.AirportCode?.value || " ";
            const arrivalTerminal = segment.Arrival?.Terminal?.Name || " ";
            const arrivalDate = segment.Arrival?.Date || " ";
            const arrivalTime = segment.Arrival?.Time || " ";

            const airlineID = segment.MarketingCarrier?.AirlineID?.value || " ";
            const flightNumber = segment.MarketingCarrier?.FlightNumber?.value || " ";
            const aircraftCode = segment.Equipment?.AircraftCode?.value || " ";
            const flightDuration = segment.FlightDetail?.FlightDuration?.Value || " ";
            const stopQuantity = segment.FlightDetail?.Stops?.StopQuantity || " ";


            // Create a unique key for each segment (e.g., Segment1, Segment2, ...)
            const segmentKey = `Segment-${i + 1}`;

        
            flightSegmentDetails.push(
                {   Segment_Number : segmentKey,
                    DepartureAirportCode: departureAirportCode || " ",
                    DepartureTerminal: departureTerminal || " ",
                    DepartureDate: departureDate || " ",
                    DepartureTime: departureTime || " ",
                    ArrivalAirportCode: arrivalAirportCode || " ",
                    ArrivalTerminal: arrivalTerminal || "",
                    ArrivalDate: arrivalDate || " ",
                    ArrivalTime: arrivalTime || " ",
                    AirlineID: airlineID || " ",
                    FlightNumber: flightNumber || " ",
                    AircraftCode: aircraftCode || " ",
                    FlightDuration: flightDuration || " ",
                    StopQuantity: stopQuantity || " ",

                });
        } // for loop end



        // OriginDestinationList
        // This section will give us the main Origin and Destination codes, not the segment codes
        const originDestination = data.DataLists?.OriginDestinationList?.OriginDestination[0];

        const originDestinationKey = originDestination?.OriginDestinationKey;
        const originalDepartureCode = originDestination?.DepartureCode?.value;
        const originalArrivalCode = originDestination?.ArrivalCode?.value;

        const originDestinationData = {
            "OriginDestinationKey": originDestinationKey,
            "OriginalDepartureCode": originalDepartureCode,
            "OriginalArrivalCode": originalArrivalCode
        };

        //Service List Details

        const serviceDetails = [];
        const serviceList = data.DataLists.ServiceList.Service;

        for (let i = 0; i < serviceList.length; i++) {
            const service = serviceList[i];

            const objectKey = service.ObjectKey;
            const detail = service.Detail || "";
            const name = service.Name?.value || '';
            const serviceID = service.ServiceID?.value || "";
            const encoding = service.Encoding || " ";
            const descriptions = service.Descriptions?.Description || [];
            const descriptionValues = descriptions.map((desc) => ({
                Application: desc.Application || '',
                Text: desc.Text?.value || '',
            }));

            const settlement = service.Settlement || ""
            const refs = service.refs ? service.refs[0] : "";
            const bookingInst = service.BookingInstructions || "";

            const associations = [];
            if (service.Associations) {
                for (const association of service.Associations) {
                    const travelerReferences = association.Traveler?.TravelerReferences || [];
                    const originDestinationReferencesOrSegmentReferences =
                        association.Flight?.originDestinationReferencesOrSegmentReferences || [];

                    associations.push({
                        TravelerReferences: travelerReferences,
                        SegmentReferences: originDestinationReferencesOrSegmentReferences,
                    });
                }
            }
            // Unique key for each service (e.g., Service1, Service2, ...)
            const serviceKey = `${i + 1}`;

            serviceDetails.push({
                Service_Number : serviceKey,
                ObjectKey: objectKey || " ",
                Name: name || " ",
                ServiceID: serviceID || "",
                Service_Coupon_Type: detail.ServiceCoupon?.CouponType?.value || "",
                RFIC_Code: encoding.RFIC?.Code || "",
                Encoding_Code: encoding.Code?.value || "",
                Encoding_SubCode: encoding.SubCode?.value || "",
                Description_Application: (descriptionValues) || "",
                Service_Associations: (associations) || " ",
                Settlement_Method_Code: settlement.Method?.Code || "",
                Refs: refs,
                BookingInstructions: (bookingInst) || ""
            })
        }

        //PriceClassList 

        const priceClassList = data.DataLists?.PriceClassList || ""
        const priceClass = priceClassList?.PriceClass[0] || " "    // To be given


        //PenaltyList 

        const dataLists = data.DataLists;
        const penalty = dataLists?.PenaltyList?.Penalty?.[0] || "";
        const detail = penalty?.Details?.Detail?.[0] || "";
        const amount = detail?.Amounts?.Amount?.[0] || "";
        const remark = amount?.ApplicableFeeRemarks?.Remark?.[0]?.value || '';
        const currencyAmountValue = amount?.CurrencyAmountValue?.value || "";

        const penaltyList = {
            ApplicableFeeRemarks: remark,
            CurrencyAmountValue: currencyAmountValue,
        };


        //DisclosureList

        const disclosureList = dataLists.DisclosureList || ""
        const disclosures = (disclosureList.Disclosures[0] || "")


        //AnonymousTravelerList

        const anonymousTravelerList = (dataLists.AnonymousTravelerList)

        //Payments
        const paymentData = data.Payments.Payment[0]
        const payment = {
            TypeCode: paymentData?.Type?.Code ?? "",
            SurchargeValue: paymentData?.Surcharge?.[0]?.value ?? 0,
            SurchargeCode: paymentData?.Surcharge?.[0]?.Code ?? "",
            AmountValue: paymentData?.Amount?.value ?? 0,
            AmountCode: paymentData?.Amount?.Code ?? "",
            CashMethodAmountValue: paymentData?.Method?.CashMethod?.Amount?.value ?? "",
            CashMethodAmountCode: paymentData?.Method?.CashMethod?.Amount?.Code ?? "",
            PaymentCardMethodCardCode: paymentData?.Method?.PaymentCardMethod?.CardCode ?? "",
            PaymentCardMethodMaskedCardNumber: paymentData?.Method?.PaymentCardMethod?.MaskedCardNumber ?? "",
            PaymentCardMethod_EffectiveExpireDate: paymentData?.Method?.PaymentCardMethod?.EffectiveExpireDate.Expiration || "",
            OtherMethodRemarks: paymentData?.Method?.OtherMethod?.Remarks?.[0]?.Remark?.[0]?.value ?? "",
            Payment_Associations: ((paymentData.Associations))
        };

        //FareList

        const fareGroup = dataLists.FareList?.FareGroup[0]; // Use optional chaining

        const Fare = {
            FareCode: fareGroup?.Fare?.FareCode?.Code ?? "defaultFareCode",
            FareCodeRefs: fareGroup?.Fare?.FareCode?.refs?.[0] ?? "defaultFareCodeRefs",
            FareDetailSegmentReference: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.SegmentReference?.value?.[0] ?? "defaultSegmentReference",
            TaxesTotalValue: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.PriceBreakdown?.Price?.Taxes?.Total?.value ?? 0,
            TaxDescriptions: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.PriceBreakdown?.Price?.Taxes?.Breakdown?.Tax?.map(tax => tax.Description) ?? ["defaultTaxDescription"],
            BaseAmountValue: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.PriceBreakdown?.Price?.BaseAmount?.value ?? 0,
            BaseAmountCode: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.PriceBreakdown?.Price?.BaseAmount?.Code ?? "defaultBaseAmountCode",
            FareBasisRBD: fareGroup?.Fare?.FareDetail?.FareComponent?.[0]?.FareBasis?.RBD ?? "defaultRBD",
            FareBasisCode: fareGroup?.FareBasisCode?.Code ?? "defaultFareBasisCode",
            FareGroupRefs: fareGroup?.refs?.[0] ?? "defaultFareGroupRefs"
        };

        //CarryOnAllowanceList
        const carryOnAllowanceList = data.DataLists?.CarryOnAllowanceList?.CarryOnAllowance ?? [];
        const CarryOnAllowance = (carryOnAllowanceList || []).map((allowance) => ({
            ListKey: allowance?.ListKey || "defaultListKey",
            AllowanceDescription: allowance?.AllowanceDescription?.ApplicableParty || "defaultAllowanceDescription",
            PieceAllowance: ((allowance?.PieceAllowance || []).map((piece) => ({
                ApplicableParty: piece?.ApplicableParty || "defaultApplicableParty",
                TotalQuantity: piece?.TotalQuantity || 0,
                PieceMeasurements: (piece?.PieceMeasurements || []).map((measurement) => ({
                    Quantity: measurement?.Quantity || 0,
                })),
            }))),
            WeightAllowance: ((allowance?.WeightAllowance?.MaximumWeight || []).map((weight) => ({
                MaximumWeightValue: weight?.Value || "defaultMaximumWeightValue",
                MaximumWeightUOM: weight?.UOM || "defaultMaximumWeightUOM",
            }))),
        }));

        const CarryOnAllowanceObject = {
            CarryOnAllowance: (CarryOnAllowance),
        };


        //CheckedBagAllowanceList
        const checkedBagAllowances = data?.DataLists.CheckedBagAllowanceList?.CheckedBagAllowance ?? [];

        const checkedBagAllowanceObject = checkedBagAllowances.map((bagAllowance, index) => {
            const pieceAllowance = bagAllowance?.PieceAllowance?.[0] ?? {};
            const pieceMeasurements = pieceAllowance?.PieceMeasurements?.[0] ?? {};
            const pieceWeightAllowance = pieceMeasurements?.PieceWeightAllowance?.[0] ?? {};
            const pieceDimensionAllowance = pieceMeasurements?.PieceDimensionAllowance?.map((dimension) => ({
                DimensionUOM: dimension?.DimensionUOM ?? "defaultDimensionUOM",
                MaxValue: dimension?.Dimensions?.[0]?.MaxValue ?? "defaultMaxValue",
            })) || [];

            return {
                [`CheckedBagAllowance_${index + 1}`]: {
                    ListKey: bagAllowance?.ListKey ?? "defaultListKey",
                    AllowanceDescription: bagAllowance?.AllowanceDescription?.ApplicableParty ?? "defaultApplicableParty",
                    TotalQuantity: pieceAllowance?.TotalQuantity ?? "defaultTotalQuantity",
                    PieceWeightAllowance: (pieceWeightAllowance?.MaximumWeight?.map((weight) => ({
                        MaximumWeightValue: weight?.Value ?? "defaultMaximumWeightValue",
                        MaximumWeightUOM: weight?.UOM ?? "defaultMaximumWeightUOM",
                    }))) || [],
                    PieceDimensionAllowance: (pieceDimensionAllowance, null),
                    Quantity: pieceMeasurements?.Quantity ?? "defaultQuantity",
                },
            };
        });


        //TicketDocInfos
        const ticketDocInfos = data.TicketDocInfos?.TicketDocInfo;

        const TicketDocInfo = (ticketDocInfos || []).map((info) => ({

            AirlineName: (info?.IssuingAirlineInfo?.AirlineName) || "",

            TicketDocument: ((info?.TicketDocument || []).map((document) => ({
                TicketDocNbr: document?.TicketDocNbr || "",
                TypeCode: document?.Type?.Code || "",
                NumberofBooklets: document?.NumberofBooklets || 0,
                DateOfIssue: document?.DateOfIssue || "",
                TicketingLocation: document?.TicketingLocation || "",
                ReportingType: document?.ReportingType || "",
            })), null, 1),
            PassengerReference: (info?.PassengerReference, null, 1) || [""],
            Price: {
                TotalValue: info?.Price?.Total?.value || 0,
                TotalCode: info?.Price?.Total?.Code || "",
            },
        }));

        const TicketDocInfoObject = {
            TicketDocInfo: TicketDocInfo,
        };

        const Output = {
            CommuterDetails,
            anonymousTravelerList,
            orderDetails,
            orderItemObject,
            order_flight_ItemsDetails,
            CarryOnAllowanceObject,
            checkedBagAllowanceObject,
            flightSegmentLevel,
            flightSegmentDetails,
            originDestinationData,
            serviceDetails,
            TicketDocInfoObject,
            priceClass,
            penaltyList,
            disclosures,
            payment,
            Fare
        }

        return Output
}
