Absensi WFH Project
How to install ?
- git clone <repo>
- cd <project>
- npm install
- .env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=absensi_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
-npm run typeorm migration:run
-npm run start:dev



Project ini adalah aplikasi web absensi WFH karyawan dengan backend menggunakan NestJS dan database PostgreSQL/MySQL.
Fitur utama backend mencakup:

Registrasi karyawan
Update profil karyawan (sendiri / oleh HRD)
Log perubahan profil


Fitur role-based access (HRD & Employee)
Endpoint untuk mengambil data profil sendiri (/api/user/me/profile)

Backend:
Framework: NestJS
ORM: TypeORM
Database: PostgreSQL
Password hashing: bcryptjs
Notifikasi realtime: WebSocket (NotificationGateway)
Logging: Database (ProfileChangeLog)
Endpoint dibagi berdasarkan role:
HRD
/api/user/register : Register user baru
api/user : Get All user
/api/user/14 : Update User
/api/user/14 : Delete User
api/attendances/hrd?from=2025-01-01&to=2026-01-05 : Summary Absensi (HRD only)
/api/user/profile-change-log : Lihat log perubahan (HRD only)

EMPLOYEE
/api/user/me : Update profil sendiri (PATCH)
/api/user/me/profile : Get profil sendiri (GET)
api/attendances : Absensi In & Out (HRD & Employee)

