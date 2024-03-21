export class PlanDTO {
  constructor(
    public id: string = '',
    public title: string = '',
    public description: string = '',
    public picture: string = '',
    public parentPlan: string = '',
    public childPlans: any = [],
    public transactions: any = [],
    public user_id: string = ''
  ) {}
}
