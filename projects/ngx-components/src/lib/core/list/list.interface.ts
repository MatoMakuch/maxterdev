export interface ListNode {
  id?: number;            // Unique identifier
  data?: any;    
  label?: string;         
  children?: ListNode[];  // Nested children nodes
  expanded?: boolean;     // Whether the node is expanded
  selected?: boolean;     // Indicates if the node is selected
}
