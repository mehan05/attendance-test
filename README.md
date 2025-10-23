# Smart Attendance Portal - Login Page

A modern, responsive login page for a Smart Attendance Portal built with React and Tailwind CSS.

## Features

- **Dual Role Login**: Separate tabs for Student and Teacher login
- **Demo Credentials**: Auto-fill functionality with test credentials
- **Google Sign-In**: Placeholder for OAuth integration
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Form Validation**: Client-side validation with success/error messages

## Demo Credentials

### Students
- `student1@college.edu` / `Pass1234`
- `student2@college.edu` / `Stud@2025`

### Teachers
- `teacher1@college.edu` / `Teach1234`
- `teacher2@college.edu` / `Prof@2025`

### Temporary User
- `temp.user@example.com` / `tempPass1`

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/
│   └── Login.js          # Main login component
├── App.js                # Root component
├── index.js              # Entry point
└── index.css             # Global styles with Tailwind
```

## Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Animations** - Smooth transitions and effects

## Features in Detail

### Tab System
- Smooth transitions between Student and Teacher login forms
- Active tab highlighting with blue accent
- Form state resets when switching tabs

### Form Validation
- Real-time validation against demo credentials
- Success/error message display
- Required field validation

### Responsive Design
- Mobile-first approach
- Flexible layout that adapts to different screen sizes
- Touch-friendly buttons and inputs

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- High contrast colors for readability

## Customization

The design can be easily customized by modifying:
- Colors in `tailwind.config.js`
- Component styles in `src/index.css`
- Form validation logic in `src/components/Login.js`

## Future Enhancements

- Backend integration for real authentication
- Password reset functionality
- Remember me option
- Multi-factor authentication
- Social login providers (Facebook, Microsoft, etc.)

