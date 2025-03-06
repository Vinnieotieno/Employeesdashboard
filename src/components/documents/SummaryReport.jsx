import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {Button, Dropdown} from 'react-bootstrap';
import { PDFViewer, PDFDownloadLink, Document as PDFDocument, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const pdfStyles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
      padding: 20,
    },
    section: {
      flexGrow: 1,
    },
    text: {
      marginBottom: 10,
    },
    label: {
        fontSize: 12,
        marginRight: 5,
        fontWeight: 'bold',
      },
      value: {
        fontSize: 12,
        marginBottom: 10,
      },
  });

const SummaryReport = ({ data, documentName }) => {
     if (!data) {
    console.error("Data is undefined or null");
    return;
  }
  const generateExcelFile = () => {
    const columns = [
      { header: 'ID', key: 'id' },
      { header: 'Date', key: 'date' }, 
      { header: 'Follow Ups', key: 'followups' },
      { header: 'New Calls', key: 'newcalls' },
      { header: 'New Client', key: 'newclient' },
      { header: 'Quotes', key: 'quotes' },
      { header: 'Quote Value', key: 'quotevalue' },
      { header: 'Sales', key: 'sales' },
      { header: 'Target', key: 'target' },
      { header: 'Variance', key: 'variance' },
    ];

    const rows = data?.map((item) => ({
      id: item.id,
      date:item.date,
      followups:item.followups,
      newcalls:item.newcalls,
      newclient:item.newclient,
      quotes:item.quotes,
      quotevalue:item.quotevalue,
      sales:item.sales,
      target:item.target,
      variance:item.variance
    }));

    const jsonData = [
        columns.map(column => column.header),
        ...rows.map(row => columns.map(column => row[column.key] || ''))
      ];

      const ws = XLSX.utils.json_to_sheet(jsonData, { skipHeader: true });

// Find empty columns and collect their indexes
const emptyColumnsIndexes = ws['!cols']?.reduce((acc, col, index) => {
  const emptyColumn = rows.every(row => !row[index]);
  if (emptyColumn) {
    acc.push(index);
  }
  return acc;
}, []);

// Remove the empty columns from the worksheet
emptyColumnsIndexes?.forEach(colIndex => {
  delete ws[XLSX.utils.encode_col(colIndex)];
});

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, documentName);

const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
const blob = new Blob([wbOut], {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
});

saveAs(blob, `${documentName}${new Date().toLocaleString()}.xlsx`);
      
  };
  const PDFContent = (
    <PDFDocument>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.section}>
        {data.map((item, index) => (
          <View key={index} style={pdfStyles.text}>
            <Text style={pdfStyles.label}>ID:</Text> <Text style={pdfStyles.value}>{item._id}</Text>
            <Text style={pdfStyles.label}>Company Name:</Text> <Text style={pdfStyles.value}>{item.companyName}</Text>
            <Text style={pdfStyles.label}>Contact Person:</Text> <Text style={pdfStyles.value}>{item.contactPerson}</Text>
            <Text style={pdfStyles.label}>Email:</Text> <Text style={pdfStyles.value}>{item.email}</Text>
            <Text style={pdfStyles.label}>Mobile:</Text> <Text style={pdfStyles.value}>{item.mobile}</Text>
            <Text style={pdfStyles.label}>Engagement Purpose:</Text> <Text style={pdfStyles.value}>{item.engagementPurpose}</Text>
            <Text style={pdfStyles.label}>Action:</Text> <Text style={pdfStyles.value}>{item.action}</Text>
            <Text style={pdfStyles.label}>Contact Person:</Text> <Text style={pdfStyles.value}>{item.contactPerson}</Text>
            <Text style={pdfStyles.label}>Email:</Text> <Text style={pdfStyles.value}>{item.email}</Text>
            <Text style={pdfStyles.label}>Mobile:</Text> <Text style={pdfStyles.value}>{item.mobile}</Text>
          </View>
        ))}
      </View>
    </Page>
  </PDFDocument>
  );


  return (
    <Dropdown className='mt-5'>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        Download <CloudDownloadIcon/>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">
            <Button variant="contained" onClick={generateExcelFile}>
        Download Excel
      </Button>
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">      
        <Button variant="light">
        <PDFDownloadLink style={{textDecoration:'none', color:"black"}} document={PDFContent} fileName={`${documentName}${new Date().toLocaleString()}.pdf`}>
        {({ blob, url, loading, error }) => (loading ? 'Loading...' : 'Download PDF')}
      </PDFDownloadLink>
      </Button>
      </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SummaryReport;
