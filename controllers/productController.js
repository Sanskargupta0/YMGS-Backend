import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, minOrderQuantity, quantityPriceList } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )
        
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            minOrderQuantity: minOrderQuantity ? Number(minOrderQuantity) : 1,
            quantityPriceList: quantityPriceList || null,
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message:"Product added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const listAllProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listProduct = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            name,
            category,
            subCategory,
            hasMinOrder,
            hasQuantityPrice
        } = req.body;

        // Build filter query
        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (category && category !== "None") {
            query.category = category;
        }

        if (subCategory && subCategory !== "None") {
            query.subCategory = subCategory;
        }

        if (hasMinOrder === true) {
            query.minOrderQuantity = { $gt: 1 };
        }

        if (hasQuantityPrice === true) {
            query.quantityPriceList = { $ne: null };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(query);

        // Get filtered and paginated products
        const products = await productModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            products,
            pagination: {
                total: totalProducts,
                pages: Math.ceil(totalProducts / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, bestseller, minOrderQuantity, quantityPriceList, existingImages, imagesToReplace } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Parse JSON strings
        let imagesUrl = existingImages ? JSON.parse(existingImages) : [];
        const replacementMap = imagesToReplace ? JSON.parse(imagesToReplace) : {};
        
        // Handle image uploads
        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];
        
        // Map positions to images
        const positionImageMap = {
            0: image1,
            1: image2,
            2: image3,
            3: image4
        };

        // Process each position separately
        const uploadPromises = [];
        const newImagesUrl = [...imagesUrl]; // Create a new array to avoid mutation issues
        
        // Process each position that needs to be replaced
        for (const position in replacementMap) {
            if (replacementMap[position] && positionImageMap[position]) {
                // This position should be replaced with a new image
                uploadPromises.push(
                    cloudinary.uploader.upload(positionImageMap[position].path, {resource_type: 'image'})
                    .then(result => {
                        newImagesUrl[position] = result.secure_url;
                    })
                );
            }
        }
        
        // Wait for all uploads to complete
        if (uploadPromises.length > 0) {
            await Promise.all(uploadPromises);
        }
        
        // Parse quantityPriceList if it's a string
        let parsedQuantityPriceList = null;
        if (quantityPriceList) {
            try {
                // If it's already a valid JSON string, parse it
                parsedQuantityPriceList = JSON.stringify(JSON.parse(quantityPriceList));
            } catch (e) {
                // If parsing fails, it might already be stringified or invalid
                console.log("Error parsing quantityPriceList:", e);
                return res.json({ success: false, message: "Invalid quantity price list format" });
            }
        }

        // Update product fields
        product.name = name;
        product.description = description;
        product.price = Number(price);
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === "true";
        product.minOrderQuantity = minOrderQuantity ? Number(minOrderQuantity) : 1;
        product.quantityPriceList = parsedQuantityPriceList;
        product.image = newImagesUrl;

        await product.save();

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {addProduct, listProduct, listAllProduct, removeProduct, editProduct}