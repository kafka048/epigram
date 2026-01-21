# NOTES WHILE CREATING THE MODEL
1. when working with typescript, for every entity, create an interface.
the interface will extend the document. -> this means that it will inherit the properties of document while adding certain properties of its own to it.

2. first the interfaces then schemas then the index of the message and then the models.
3. no zod for user schema. why?
4. mongodb will provide a default id to it of the attribute _id. so no need to declare it as a separate attribute.
5. use of regex in email: use **match** attribute

6. use of ref: This ObjectId points to a document in another collection.
therefore, ref = "USER"
7. set a default for the created At
8. When you use referencing, you export both models. They are independent entities. They are queried independently. Referencing does not merge models.


## FUNDAMENTAL PROBLEMS
1. put unique as true on recipientId -> this will break the one - many relationship 
2. put unique as true on createdAt -> put it when i was actually aware of it
3. inconsistency with hashedPassword -> do not keep required true when using google oauth.
4. missed the index creation -> index will be created using the messageSchema with the compound index structure

5. prefer timestamps over manual createdAt. timestamps provide createdAt and updatedAt and other such attributes