students = {}
attendance = {}
fees = {}
exams = {}
results = {}

def admit_student():
    roll = input("Enter Roll Number: ")
    name = input("Enter Student Name: ")
    students[roll] = name
    attendance[roll] = []
    fees[roll] = 0
    print("Student admitted successfully!\n")

def pay_fee():
    roll = input("Enter Roll Number: ")
    if roll in students:
        amount = float(input("Enter Fee Amount: "))
        fees[roll] += amount
        print("Fee paid successfully!\n")
    else:
        print("Student not found!\n")

def mark_attendance():
    roll = input("Enter Roll Number: ")
    if roll in students:
        status = input("Present / Absent: ")
        attendance[roll].append(status)
        print("Attendance marked!\n")
    else:
        print("Student not found!\n")

def schedule_exam():
    exam_name = input("Enter Exam Name: ")
    date = input("Enter Exam Date: ")
    exams[exam_name] = date
    print("Exam scheduled successfully!\n")

def add_result():
    roll = input("Enter Roll Number: ")
    if roll in students:
        subject = input("Enter Subject: ")
        marks = input("Enter Marks: ")
        results.setdefault(roll, {})[subject] = marks
        print("Result added!\n")
    else:
        print("Student not found!\n")

def display_student():
    roll = input("Enter Roll Number: ")
    if roll in students:
        print("\nName:", students[roll])
        print("Fees Paid:", fees[roll])
        print("Attendance:", attendance[roll])
        print("Results:", results.get(roll, {}))
        print()
    else:
        print("Student not found!\n")

while True:
    print("=== School Management System ===")
    print("1. Student Admission")
    print("2. Pay Fee")
    print("3. Mark Attendance")
    print("4. Schedule Exam")
    print("5. Add Result")
    print("6. Display Student Details")
    print("7. Exit")

    choice = input("Enter your choice: ")

    if choice == '1':
        admit_student()
    elif choice == '2':
        pay_fee()
    elif choice == '3':
        mark_attendance()
    elif choice == '4':
        schedule_exam()
    elif choice == '5':
        add_result()
    elif choice == '6':
        display_student()
    elif choice == '7':
        print("Exiting... Thank you!")
        break
    else:
        print("Invalid choice!\n")