import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Category } from "../../features/dashboard/categories/models";
import { generateString } from "../../shared/utils";

let CATEGORIES_DB: Category[] = [
    {
        id: generateString(6),
        name: 'Computación',
        createdAt: new Date(),
    },
    {
        id: generateString(6),
        name: 'Celulares',
        createdAt: new Date(),
    },
    {
        id: generateString(6),
        name: 'Calzado',
        createdAt: new Date(),
    },
]

@Injectable({
    providedIn: 'root'
})

export class CategoriesService {
    /*
        ABM: Listar, crear, actualizar o eliminar
    */
    getCategories(): Observable<Category[]> {
        return of([...CATEGORIES_DB]);
    }

    createCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
        const categoryCreated = {...category, id: generateString(6), createdAt: new Date()};
        CATEGORIES_DB.push(categoryCreated);
        return of(categoryCreated)
    }

    editCategory(id: string, category: Partial<Category>): Observable<Category> {

        const categoryToEdit = CATEGORIES_DB.find((cat) => cat.id === id);

        if (!categoryToEdit)
            return throwError(() => new Error('No se encontró la categoría'));

        CATEGORIES_DB = CATEGORIES_DB.map((cat) => cat.id === id ? {...categoryToEdit, ...category} : cat)

        return of(categoryToEdit);
    }

}