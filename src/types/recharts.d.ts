declare module 'recharts' {
    import { ReactNode, ComponentType } from 'react';

    export interface RechartsProps {
        children?: ReactNode;
        [key: string]: any;
    }

    export const ResponsiveContainer: ComponentType<RechartsProps>;
    export const LineChart: ComponentType<RechartsProps>;
    export const Line: ComponentType<RechartsProps>;
    export const AreaChart: ComponentType<RechartsProps>;
    export const Area: ComponentType<RechartsProps>;
    export const BarChart: ComponentType<RechartsProps>;
    export const Bar: ComponentType<RechartsProps>;
    export const XAxis: ComponentType<RechartsProps>;
    export const YAxis: ComponentType<RechartsProps>;
    export const Tooltip: ComponentType<RechartsProps>;
    export const CartesianGrid: ComponentType<RechartsProps>;
    export const Legend: ComponentType<RechartsProps>;
    export const PieChart: ComponentType<RechartsProps>;
    export const Pie: ComponentType<RechartsProps>;
    export const Cell: ComponentType<RechartsProps>;
}
