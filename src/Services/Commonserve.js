// Common service functions for CRUD operations



//------- Generate unique ID for any model
const generateUniqueId = async (Model) => {
    try {
        // Get the model name prefix (first 3 letters in uppercase)
        const modelPrefix = Model.modelName.substring(0, 3).toUpperCase();

        // Find the last created document to get the next sequence number
        const lastDoc = await Model.findOne(
            { [`${Model.modelName.toLowerCase()}Id`]: { $regex: `^${modelPrefix}` } },
            {},
            { sort: { [`${Model.modelName.toLowerCase()}Id`]: -1 } }
        );

        let nextNumber = 1;
        if (lastDoc) {
            const idField = `${Model.modelName.toLowerCase()}Id`;
            if (lastDoc[idField]) {
                // Extract the numeric part and increment
                const lastNumber = parseInt(lastDoc[idField].substring(3));
                nextNumber = lastNumber + 1;
            }
        }

        // Generate the new unique ID with format: USR00001, PRO00001, etc.
        return `${modelPrefix}${nextNumber.toString().padStart(5, '0')}`;
    } catch (error) {
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};


//------- Add a new document
const addDoc = async (data, Model) => {
    try {
        // Generate unique ID for the document
        const uniqueId = await generateUniqueId(Model);
        const idField = `${Model.modelName.toLowerCase()}Id`;

        // Add the unique ID to the data
        const dataWithId = {
            ...data,
            [idField]: uniqueId
        };

        const createdDoc = await Model.create(dataWithId);
        return { success: true, data: createdDoc };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

//------- Get all documents
const getAllDocs = async (Model) => {
    try {
        const docs = await Model.find({})
        return { success: true, data: docs }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

//------- Get a document by unique ID
const getDocById = async (id, Model) => {
    try {
        // Use the model-specific unique ID field (userId, productId, etc.)
        const idField = `${Model.modelName.toLowerCase()}Id`;
        const doc = await Model.findOne({ [idField]: id });
        return { success: true, data: doc };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

//------- Update a document by unique ID
const updateDocById = async (id, data, Model) => {
    try {
        // Use the model-specific unique ID field (userId, productId, etc.)
        const idField = `${Model.modelName.toLowerCase()}Id`;
        const updatedDoc = await Model.findOneAndUpdate(
            { [idField]: id }, 
            data, 
            { new: true }
        );
        return { success: true, data: updatedDoc };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

//------- Delete a document by unique ID
const deleteDocById = async (id, Model) => {
    try {
        // Use the model-specific unique ID field (userId, productId, etc.)
        const idField = `${Model.modelName.toLowerCase()}Id`;
        const deletedDoc = await Model.findOneAndDelete({ [idField]: id });
        return { success: true, data: deletedDoc };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

//------- Get all documents with filter and pagination
const getAllWithFilter = async (filter, page, limit, Model) => {
    try {
        const skip = (page - 1) * limit;
        const docs = await Model.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Model.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            success: true,
            data: docs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalCount: totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export { addDoc, getAllDocs, getDocById, updateDocById, deleteDocById, getAllWithFilter }