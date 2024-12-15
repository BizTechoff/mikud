import { Entity, Fields, IdEntity } from "remult";

@Entity("tasks", {
    allowApiCrud: true
})
export class Task extends IdEntity {

    @Fields.string()
    title!: string;

    @Fields.string()
    description!: string;

    @Fields.string()
    assignee!: string;

    @Fields.date()
    dueDate!: Date;

    @Fields.boolean({ defaultValue: () => false })
    isCompleted = false;

}
