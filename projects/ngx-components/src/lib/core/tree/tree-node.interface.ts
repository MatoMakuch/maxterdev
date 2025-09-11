export interface TreeNode {
  id?: number;            // Unique identifier
  data?: any;    
  label?: string;         
  children?: TreeNode[];  // Nested children nodes
  expanded?: boolean;     // Whether the node is expanded
  selected?: boolean;     // Indicates if the node is selected
  indeterminate?: boolean;
  level?: number;         
  parent?: TreeNode;
}
