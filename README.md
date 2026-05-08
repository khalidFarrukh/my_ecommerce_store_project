# FK Store – Full-Stack eCommerce Application

A full-stack eCommerce web application built independently using Next.js, Node.js, and MongoDB. The application includes a complete product management system, authentication, and order lifecycle workflow similar to real-world platforms.

## 🚀 Features
- Role-based authentication (Admin/User) using NextAuth.js  
- Admin dashboard for managing products, orders, and inventory  
- Dynamic product system with variants (price, stock, options)
- Inventory management system with stock tracking  
- Complete order lifecycle (pending → confirmed → shipped → delivered)  
- Search and filtering functionality  
- Responsive UI with optimized performance  

## 🛠 Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js, REST APIs  
- **Database:** MongoDB / PostgreSQL (Prisma ORM)  
- **Authentication:** NextAuth.js

## 🔮 Planned Improvements
- Product rating and review system  
- Customer Q&A section

## Skipped
- Payment gateway integration
(it is just an demo project, and even though i still wanted to connect stripes sandbox version, but as it turned out, person from pakistan can't do it. but still the project provides payment via COD). 

## Important Note
in this project i am using neon's cloud db environment for hosting PostgreSQL db, free tier, so what happens is that after sometime cluster/whatever becomes inactive. if you create an account or sign in, and enter the credentials, in case you had account and went for sign-in, you entered the credentials right but still got invalid email or password, that would be because either the db is inactive, or your dont have internet, in case you have internet and then just try 1 to 3 times, for me it always works 90% of times because i constantly engage with db to test the site, sometime, i had long delay when didn't worked on the project, so db node becomes inactive, so that is it will work for sure in next try.

## 🌐 Live Demo
https://project-o7e3d.vercel.app/

## 💻 GitHub Repository
https://github.com/khalidFarrukh/my_ecommerce_store_project

## 📸 Screenshots
(Add 2–3 screenshots here: homepage, admin dashboard, product page)

homepage
<img width="1901" height="924" alt="image" src="https://github.com/user-attachments/assets/155ae2bc-58bd-4555-ac8f-c309a20c1486" />

admin dashboard
<img width="1893" height="913" alt="image" src="https://github.com/user-attachments/assets/7f2d8f77-4f8e-47cc-8f56-3343ed90ef8c" />

product page - image 1
<img width="1897" height="908" alt="image" src="https://github.com/user-attachments/assets/648e7e6a-dd2a-4d46-b136-136a741bf323" />

product page - image 2
<img width="1896" height="917" alt="image" src="https://github.com/user-attachments/assets/cce548be-5848-4ed7-a7cb-5b934624b6ea" />

cart page
<img width="1892" height="917" alt="image" src="https://github.com/user-attachments/assets/4eacb173-28ee-4513-bea1-0a58ecba78c9" />

checkout page
<img width="1893" height="915" alt="image" src="https://github.com/user-attachments/assets/c12ad757-67e5-4bdb-9fb5-0c91a569626c" />

order page
<img width="1895" height="918" alt="image" src="https://github.com/user-attachments/assets/faa62a37-93e8-4854-ae1e-86cd0a391816" />

admin dashboard 2 after update
<img width="1898" height="916" alt="image" src="https://github.com/user-attachments/assets/4aa1d02c-675c-4b91-a338-086fc1ff7165" />

## 👨‍💻 Contribution
This project was developed independently and design is inspired by medusa store, covering both frontend and backend architecture.
