export declare class CreateWorkflowDto {
    name: string;
    description: string;
    type: 'inbound' | 'outbound' | 'bi_directional';
    trigger: any;
    steps: any[];
    configuration?: any;
}
