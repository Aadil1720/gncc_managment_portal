import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';

// React-PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 25,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottom: '2pt solid #1a4b8c',
    paddingBottom: 15,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1pt solid #e0e0e0',
    borderRadius: 4,
  },
  logo: {
    width: 70,
    height: 70,
  },
  headerText: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a4b8c',
    marginBottom: 4,
  },
  clubFullName: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a4b8c',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  receiptSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    border: '1pt solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a4b8c',
    borderBottom: '1pt solid #1a4b8c',
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    width: '40%',
  },
  value: {
    fontSize: 10,
    color: '#555',
    width: '60%',
    textAlign: 'right',
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a4b8c',
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1pt solid #e0e0e0',
    backgroundColor: '#fff',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1pt solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableCellParticulars: {
    flex: 3,
    fontSize: 10,
  },
  tableCellParticularsHeader: {
    flex: 3,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1a4b8c',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  totalCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalCellParticulars: {
    flex: 3,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  remarksSection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff9e6',
    border: '1pt solid #ffd966',
    borderRadius: 4,
  },
  remarksTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#b38c00',
  },
  remarksText: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: '1pt solid #e0e0e0',
    paddingTop: 10,
  },
  watermark: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 60,
    color: 'rgba(26, 75, 140, 0.05)',
    fontWeight: 'bold',
    transform: 'rotate(-30deg)',
  },
  receiptNumber: {
    position: 'absolute',
    top: 25,
    right: 25,
    fontSize: 9,
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: 4,
    border: '1pt solid #e0e0e0',
  },
});

// React-PDF Document Component
const FeeSlipDocument = ({ feeData, studentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <Text style={styles.watermark}>GNCC</Text>
      
      {/* Receipt Number */}
      <Text style={styles.receiptNumber}>Receipt #: {feeData.receiptNumber || `GNCC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}</Text>
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            style={styles.logo} 
            src="images/logo_gncc.jpg" 
            alt="GNCC Logo"
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.clubFullName}>GREATER NOIDA CRICKET CLUB</Text>
          <Text style={styles.clubName}>GNCC</Text>
        </View>
      </View>
      
      {/* Receipt Title */}
      <Text style={styles.receiptTitle}>FEE RECEIPT</Text>
      <Text style={styles.receiptSubtitle}>Academic Year {feeData.year} | Official Payment Confirmation</Text>
      
      {/* Student Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{studentData.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Admission Number:</Text>
          <Text style={styles.value}>{studentData.admissionNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Father's Name:</Text>
          <Text style={styles.value}>{studentData.fatherName || 'N/A'}</Text>
        </View>
        {studentData.class && (
          <View style={styles.row}>
            <Text style={styles.label}>Class/Batch:</Text>
            <Text style={styles.value}>{studentData.class}</Text>
          </View>
        )}
      </View>
      
      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Month:</Text>
          <Text style={styles.value}>{feeData.month} {feeData.year}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date Paid:</Text>
          <Text style={styles.value}>{new Date(feeData.datePaid).toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{feeData.paymentMode || 'Cash'}</Text>
        </View>
      </View>
      
      {/* Fee Breakdown Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fee Breakdown</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellParticularsHeader}>Particulars</Text>
            <Text style={styles.tableCellHeader}>Amount (₹)</Text>
          </View>
          
          {feeData.admissionFees > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCellParticulars}>Admission Fees</Text>
              <Text style={styles.tableCell}>₹{feeData.admissionFees.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {feeData.tuitionFees > 0 && (
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableCellParticulars}>Tuition Fees</Text>
              <Text style={styles.tableCell}>₹{feeData.tuitionFees.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {feeData.transportFees > 0 && (
            <View style={feeData.admissionFees > 0 && feeData.tuitionFees > 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.tableCellParticulars}>Transport Fees</Text>
              <Text style={styles.tableCell}>₹{feeData.transportFees.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {/* Add more fee items as needed */}
          {feeData.otherFees > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCellParticulars}>Other Fees</Text>
              <Text style={styles.tableCell}>₹{feeData.otherFees.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalCellParticulars}>TOTAL AMOUNT PAID</Text>
            <Text style={styles.totalCell}>₹{feeData.totalAmountPaid.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>
      
      {/* Remarks Section */}
      {feeData.remarks && (
        <View style={styles.remarksSection}>
          <Text style={styles.remarksTitle}>Remarks / Additional Information</Text>
          <Text style={styles.remarksText}>{feeData.remarks}</Text>
        </View>
      )}
      
      {/* Footer */}
      <Text style={styles.footer}>
        This is a computer generated receipt. No signature required. • 
        Generated on: {new Date().toLocaleString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })} • 
        Greater Noida Cricket Club © {new Date().getFullYear()}
      </Text>
    </Page>
  </Document>
);

// Export the component
export default FeeSlipDocument;