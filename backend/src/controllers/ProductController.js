        import Product from "../models/ProductModel.js";
        import path from "path";
        /* FILE SYSTEM BAWAAN NODE JS */
        import fs from "fs";
        

        export const getProduct = async(req, res)=>{
            try {
                const response = await Product.findAll();
                res.json(response);
            } catch (error) {
                console.log(error.message);
            }
        }

        export const getProductById = async(req,res)=>{
            try {
                const response = await Product.findOne({
                    where:{
                        id : req.params.id
                    }
                });
                res.json(response);
            } catch (error) {
                console.log(error.message);
            }
        }

        export const saveProduct = (req, res) =>{
            if(req.file === null)return res.status(400).json({msg: "No File Uploaded"}); 

            const name = req.body.title;
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);

            /* convert file menjadi md5 */
            const fileName = file.md5 + ext;
            const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png','.jpg','.jpeg'];

            if(!allowedType.includes(ext.toLowerCase()))return res.status(422).json({msg: "Invalid Images"});

            if(fileSize > 5000000)return res.status(422).json({msg: "Image Must Be Less Than 5 MB"});

            /* save kedalam folder public\image */
            file.mv(`./public/images/${fileName}`, async(err)=>{
                if(err) return res.status(500).json({msg: "err.message"});

                try {
                    await Product.create({name: name, image: fileName, url: url});
                    res.status(201).json({msg: "Product Create Successfully"});
                } catch (error) {
                    console.log(error.message);
                }
            });
        }

        export const updateProduct = async(req,res) =>{
            const product = await Product.findOne({
                where:{
                    id : req.params.id
                }
            });

            if(!product) return res.status(404).json({msg: "No Data Found"});
            let fileName = "";

            if(req.files === null){
                fileName = Product.image;
            }else{
                const file = req.files.file;
                const fileSize = file.data.length;
                const ext = path.extname(file.name);
                fileName = file.md5 + ext;
                const allowedType = ['.png','.jpg','.jpeg'];

                if(!allowedType.includes(ext.toLowerCase()))return res.status(422).json({msg: "Invalid Images"});
                if(fileSize > 5000000)return res.status(422).json({msg: "Image Must Be Less Than 5 MB"});

                /* berfungsi untuk menghapus image yang lama */
                const filepath = `./public/images/${product.image}`;
                fs.unlinkSync(filepath);

                /* save kedalam folder public\image */
                file.mv(`./public/images/${fileName}`, (err)=>{
                    if(err) return res.status(500).json({msg: "err.message"});
                });
            }

            const name = req.body.title;
            const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

            try {
                await Product.update({name: name, image: fileName, url: url},{
                    where:{
                        id: req.params.id
                    }
                });
                res.status(200).json({msg: "Product Updated Successfully"});
            } catch (error) {
                console.log(error.message);
            }

        }

        export const deleteProduct = async(req,res) =>{
            const product = await Product.findOne({
                where:{
                    id: req.params.id
                }
            });
            if(!product) return res.statys(404).json({msg: "No Data Found!"});

            try {
                const filepath = `./public/images/${product.image}`
                fs.unlinkSync(filepath);
                await Product.destroy({
                    where:{
                        id: req.params.id
                    }
                });
                res.status(200).json({msg: "Product Deleted Successfully"});
            } catch (error) {
                console.log(error.message);
            }
        }