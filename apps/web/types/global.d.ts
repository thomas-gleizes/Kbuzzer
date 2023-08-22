declare type Component<Props = {}> = React.FC<Props>
declare type ComponentWithChildren<Props = {}> = Component<Props & React.PropsWithChildren>
