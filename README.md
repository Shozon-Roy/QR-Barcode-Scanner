# QR & Barcode Scanner/Generator

A mobile-friendly QR code and barcode scanning/generating application with advanced theming and user experience features.

![QR & Barcode Scanner/Generator](https://via.placeholder.com/800x400?text=QR+%26+Barcode+Scanner+Screenshot)

## 📱 Features

### Scanning 
- Scan QR codes and barcodes using your device's camera
- Import images containing QR codes and barcodes for scanning
- Instant recognition and parsing of different code formats
- Automatic handling of different content types (URLs, text, contacts, etc.)
- Haptic and sound feedback on successful scans

### Generation
- Create QR codes with custom content, colors and styles
- Generate various types of barcodes (CODE128, UPC, EAN, etc.)
- Save generated codes to your device or share them directly
- Customize appearance with multiple design options

### History Management
- View history of all scanned and created codes
- Organize codes into favorites for quick access
- Search and filter through your code history
- Delete individual items or clear entire history

### User Experience
- Responsive design optimized for mobile devices
- Dark and light theme support with smooth transitions
- Intuitive navigation with bottom tab bar
- No internet connection required for core functionality

## 💻 Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with custom components
- **Component Library**: ShadCN UI components
- **Icons**: Lucide React icons
- **QR Code Generation**: qrcode.js library
- **Barcode Generation**: JsBarcode library
- **QR Code Scanning**: html5-qrcode library

## 🔧 Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/qr-barcode-scanner.git
```

2. Navigate to the project directory:
```
cd qr-barcode-scanner
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm run dev
```

## 🚀 Usage

### Scanning QR Codes
1. Navigate to the "Scanner" tab
2. Grant camera permissions when prompted
3. Point your camera at any QR code or barcode
4. Results will be displayed automatically

### Generating QR Codes
1. Navigate to the "Generate" tab
2. Choose between QR code or barcode
3. Select the specific format type
4. Enter your content
5. Customize appearance if desired
6. Click "Create" to generate the code

### Managing History
1. Navigate to the "History" tab
2. Browse through your scanned and created codes
3. Filter by type or add items to favorites
4. Use the action buttons to edit, share, or delete items

## ⚙️ Settings

The app includes various customization options:
- Toggle between light and dark themes
- Enable/disable save history functionality
- Control vibration and sound feedback
- Configure auto-opening of URLs
- Enable automatic clipboard copying

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Made with 💖 by Shozon Roy

## 🙏 Acknowledgements

- [qrcode.js](https://github.com/davidshimjs/qrcodejs) for QR code generation
- [JsBarcode](https://github.com/lindell/JsBarcode) for barcode generation
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) for QR code scanning
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ShadCN UI](https://ui.shadcn.com/) for UI components
- [Lucide Icons](https://lucide.dev/) for beautiful iconography
- [Framer Motion](https://www.framer.com/motion/) for smooth animations