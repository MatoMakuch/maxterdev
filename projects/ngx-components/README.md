<p align="center">
  <img src="https://raw.githubusercontent.com/MatoMakuch/maxterdev/main/projects/ngx-components/src/lib/assets/maxter-dev.svg" alt="MaxterDev Logo" width="200"/>
</p>

<h1 align="center">MaxterDev NGX Components</h1>

<p align="center">
  🚀 Highly Flexible and Customizable Components Library for Angular
</p>

---

## 📦 Installation
Install the library using npm:

```bash
npm install @maxter-dev/ngx-components
```

---

## 🚀 Quick Start
### Import and Use a Component
Example usage for the `CheckboxComponent`:

1. **Import the component** into your Angular app:

```typescript
import { Component } from '@angular/core';
import { CheckboxComponent } from '@maxter-dev/ngx-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <maxterdev-checkbox 
      [checked]="isChecked" 
      [disabled]="isDisabled"
      (checkedChange)="handleCheckboxChange($event)">
    </maxterdev-checkbox>
  `
})
export class AppComponent {
  isChecked = false;
  isDisabled = false;

  handleCheckboxChange(value: boolean) {
    console.log('Checkbox changed:', value);
    this.isChecked = value;
  }
}
```

---

### 🌈 Import Global Styles
To include the library's global styles (like buttons, typography, etc.), add the following to your **`styles.scss`**:

```scss
@import '@maxter-dev/ngx-components/assets/styles/main.scss';
```

---

## 📚 Available Components
| Component | Selector | Description |
| --------- | -------- | ----------- |
| ✅ Checkbox | `<maxterdev-checkbox>` | Customizable checkbox component |
| ✅ Dropdown | `<maxterdev-dropdown>` | Customizable dropdown component |
| ✅ Table | `<maxterdev-table>` | Flexible table component |
| ✅ List | `<maxterdev-list>` | Highly configurable list component |
| ✅ Tabs | `<maxterdev-tabs>` | Multi-tab navigation component |

---

## 🛠️ Customization
All components support extensive customization via:
- **Inputs** → Change behavior and data dynamically  
- **Outputs** → Handle events and state changes  
- **Styling** → Fully customizable with SCSS variables  

---

## 🏆 Why Use MaxterDev NGX Components?
✅ Fully compatible with **Angular 18+**  
✅ Clean and modern API  
✅ Lightweight and tree-shakable  
✅ Modular architecture  
✅ Open-source and actively maintained  

---

## 📥 Contributing
We welcome contributions!  
1. Fork the repository  
2. Create a branch  
3. Submit a pull request  

---

## 🔗 Links
- **NPM Package:** [@maxter-dev/ngx-components](https://www.npmjs.com/package/@maxter-dev/ngx-components)  
- **GitHub:** [https://github.com/MaxterDev/ngx-components](https://github.com/MaxterDev/ngx-components)  

---

## ⚖️ License
Licensed under the **MIT** License.

---

<p align="center">
✨ Developed with ❤️ by <b>MaxterDev</b>
</p>