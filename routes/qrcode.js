import {Router} from "express";
import {Product} from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';

import QRCode from "qrcode";
import PDFDocument from "pdfkit";

dotenv.config();
const router = Router();
router.use(verifyjwt);

router.get("/products/qrcode/:pid", async (request, response) => {

    const pid = request.params.pid;
    try {
        const product = await Product.findOne({ where: { pid: pid } });
        if (!product) {
            return response.status(404).json({ error: "Product not found" });
        }

        const productData = JSON.stringify(product);

        QRCode.toDataURL(productData, (err, url) => {
            if (err) {
                return response.status(500).json({ error: "Failed to generate QR code" });
            }

            // Create a PDF document
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                response.setHeader('Content-Type', 'application/pdf');
                response.setHeader('Content-Disposition', 'inline; filename=qrcode.pdf');              
                response.send(pdfData);


                
            });


            // Add title
            doc.fontSize(24).font('Helvetica-Bold').text(`Product: ${product.name}`, {
                align: 'center'
            });

            // Calculate center position for the QR code
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const qrCodeSize = 250;
            const x = (pageWidth - qrCodeSize) / 2;
            const y = (pageHeight - qrCodeSize) / 2;

            // Add QR code to the PDF at the center
            doc.image(url, x, y, {
                fit: [250, 250],
                align: 'center',
                valign: 'center'
            });

            // Add sentence below the QR code
            doc.moveDown();
            doc.fontSize(12).font('Helvetica').text(`Price: $${product.price}\n `, {
                align: 'center'
            });


            // Finalize the PDF
            doc.end();

            
        });
    

    } catch (error) {
        response.status(400).json({ error: error.message });
    }


        

});

router.post("/products/qrcode-update", async (request, response) => {
    try {
      const { body: { qrCodeContent } } = request;
  
      // Parse the QR code content
      const productData = JSON.parse(qrCodeContent);
  
      // Locate the product in the database
      const product = await Product.findOne({ where: { pid: productData.pid } });
  
      // Check if the product exists
      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }
  
      // Check stock and update if sufficient
      if (product.stock > 0) {
        product.stock -= 1; // Decrement stock
        await product.save(); // Save changes to the database
        return response.json({ message: "Product stock updated successfully", product });
      } else {
        return response.status(400).json({ error: "Insufficient stock" });
      }
    } catch (error) {
      // Log and return the error message
      console.error("Error updating product stock:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  });
  
  export default router;
  