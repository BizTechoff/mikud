import { Entity, Fields, IdEntity } from "remult";

@Entity("tasks", {
    allowApiCrud: true
})
export class Task extends IdEntity {

    @Fields.string({caption: 'ממוקד'})
    whom!: string;

    @Fields.string({caption: 'כותרת'})
    title!: string;

    @Fields.string({caption: 'תיאור'})
    description!: string;

    @Fields.string({caption: 'שם החבר'})
    assignee!: string;

    @Fields.dateOnly({caption: 'תאריך יעד'})
    dueDate = new Date()

    @Fields.boolean({ caption:'הסתיים', defaultValue: () => false })
    isCompleted = false;

    @Fields.updatedAt({caption: 'עודכן'})
    updated!: Date

}
