// // Enums
// enum Role {
//   USER
//   ADMIN
// }

// enum ShiftStatus {
//   ACTIVE
//   PENDING
// }

// enum JobStatus {
//   OPEN
//   FULL
//   CLOSED
// }

// enum ApplicationStatus {
//   APPLIED
//   INTERVIEWED
//   HIRED
// }

// enum ShiftCategory {
//   ONE_SHIFT
//   TWO_SHIFT
//   THREE_SHIFT
// }

// // Models
// model User {
//   id                Int                  @id @default(autoincrement())
//   email             String               @unique
//   password          String
//   role              Role                 @default(USER)
//   createdAt         DateTime             @default(now())
//   updatedAt         DateTime             @updatedAt

//   shifts            Shift[]
//   compensation      CompensationSetting?
//   jobApplications   JobApplication[]
// }

// model Shift {
//   id                Int                  @id @default(autoincrement())
//   userId            Int
//   workplace         String
//   startTime         DateTime
//   endTime           DateTime
//   status            ShiftStatus          @default(ACTIVE)
//   createdAt         DateTime             @default(now())
//   updatedAt         DateTime             @updatedAt
//   deletedAt         DateTime?

//   user              User                 @relation(fields: [userId], references: [id])
//   compensation      ShiftCompensation?
// }

// model ShiftTypeConfig {
//   id                Int                  @id @default(autoincrement())
//   shiftComId        Int
//   category          ShiftCategory        // ONE_SHIFT, TWO_SHIFT, THREE_SHIFT
//   name              String               // เช่น ONEDAY, DAY, NIGHT, MORNING, EVENING
//   payRate           Decimal              // เรทค่าเวรของแต่ละประเภทใน รพ. นั้นๆ

//   setting           CompensationSetting  @relation(fields: [shiftComId], references: [id], onDelete: Cascade)
// }

// model ShiftCompensation {
//   id                Int                  @id @default(autoincrement())
//   userId            Int
//   shiftId           Int                  @unique
//   payRate           Decimal
//   shiftType         String               // บันทึกประเภทเวรที่ลงจริงในวันนั้น

//   shift             Shift                @relation(fields: [shiftId], references: [id])
// }

// model CompensationSetting {
//   id                Int                  @id @default(autoincrement())
//   userId            Int                  @unique
//   workplace         String?              // ชื่อสถานพยาบาลที่ผูกกับค่าตั้งค่านี้
//   baseSalary        Decimal?             // เงินเดือน (กรณีมีงานประจำ)
//   specialAllowance  Decimal?             // เงินพิเศษ / เงินประจำตำแหน่ง / พตส.

//   user              User                 @relation(fields: [userId], references: [id])
//   deductions        Deduction[]
//   shiftTypes        ShiftTypeConfig[]
// }

// model Deduction {
//   id                Int                  @id @default(autoincrement())
//   settingId         Int
//   name              String               // ชื่อรายการหัก
//   amount            Decimal              // จำนวนเงินที่หัก (รองรับทั้งบาทและคำนวณจากเปอร์เซ็นต์แล้ว)
//   isPercent         Boolean              @default(false) // ระบุว่าเป็นแบบเปอร์เซ็นต์หรือไม่

//   setting           CompensationSetting  @relation(fields: [settingId], references: [id], onDelete: Cascade)
// }

// model JobDemand {
//   id                Int                  @id @default(autoincrement())
//   title             String
//   location          String               // สถานพยาบาล
//   aboutWord         String?              // ข้อมูลวอร์ด
//   compensation      Float                // เรทราคา
//   status            JobStatus            @default(OPEN)
//   isHighlighted     Boolean              @default(false) // ข้อมูลด่วน / ไม่ด่วน
//   createdAt         DateTime             @default(now())
//   updatedAt         DateTime             @updatedAt
//   deletedAt         DateTime?

//   applications      JobApplication[]
// }

// model JobApplication {
//   id                Int                  @id @default(autoincrement())
//   jobId             Int
//   userId            Int
//   status            ApplicationStatus    @default(APPLIED)
//   createdAt         DateTime             @default(now())

//   job               JobDemand            @relation(fields: [jobId], references: [id])
//   user              User                 @relation(fields: [userId], references: [id])
// }
