const studentViewFields = [
  "name, email",
  "age",
  "language",
  "bookingsId",
  "lessonsId",
  "availabiltysId",
]; //show first avaiablbility. or make sure tehre is only one

const teacherViewFields = ["name", "language", "lessonsId", "sessionsId"];

const bookingViewFields = ["student_id", "start_date"];

const lessonViewFields = ["teacher_id", "student_id", "status"];

//thi is jsut an init file
// idea here is to declare what relationshships are important when we render teh model/id page to give good feecback to the user

//we also need a depenedncy, that is when im creating a student, i shouold see avaiable userId with no role yet
//or when im creating a session, associate it with the lesson
//or when im doing a lesson, see avaiable bookings

/* ptoposal
{
    model_name/student: {
        onFormCreate: {
        authId: getAuthId.rol = guest
        avaibliityWindow: calender picker.
        }  
        relationships: {
         lessons: { total bumber of lessons}
         bookings: { total number of bookings}
         teachers: { array of teachers name with number of hours}
         avaiablibity: {when there ability calender was last activated}
}
         fucntions: {
            getTotalToPay:
            getTotalBookingsFee: hours, price
            getNumberOfHoursLeft: 
         }
}
}




*/
