import { Course } from "../../courses/models";
import { Student } from "../../students/models";

export interface Sale {
    id: string;
    studentId: string;
    productId: string;
    student?: Student;
    course?: Course;
}