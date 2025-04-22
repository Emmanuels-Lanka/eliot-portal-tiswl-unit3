"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment-timezone";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputTable: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 30,
  },
  resultTable: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#D3D3D3',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  paramCell: {
    width: '60%',
    padding: 8,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    textAlign: 'left',
  },
  valueCell: {
    width: '40%',
    padding: 8,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: 'gray',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export const ROIPDFDocument = ({
  data,
}: {
  data: {
    currentDailyProduction: number;
    newDailyProduction: number;
    totDailyProduction: number;
    totNewDailyProduction: number;
    additionalGarmentPerDay: number;
    additionalGarmentPerMonth: number;
    additionalRevenuePerMonth: number;
    additionalCostPerMonth: number;
    additionalProfitPerMonth: number;
    additionalProfitPerYear: number;
    inputs: {
      sewingMachines: number;
      smv: number;
      line: number;
      workHours: number;
      workDays: number;
      currentOperEfficiency: number;
      newOperEfficiency: number;
      price: number;
      cost: number;
    };
  };
}) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ELIOT DEPLOYMENT ROI CALCULATION</Text>
        <Text style={styles.subTitle}>Based on Operator Efficiency Gain</Text>
        <View style={styles.separator} />
      </View>

      {/* Input Parameters Section */}
      <Text style={styles.sectionTitle}>Input Parameters</Text>
      <View style={styles.inputTable}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.paramCell}>Parameter</Text>
          <Text style={styles.valueCell}>Value</Text>
        </View>
        
        {/* Input Rows */}
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Number of Lines</Text>
          <Text style={styles.valueCell}>{data.inputs.line}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Sewing Machines per Line</Text>
          <Text style={styles.valueCell}>{data.inputs.sewingMachines}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>SMV per Garment (minutes)</Text>
          <Text style={styles.valueCell}>{data.inputs.smv}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Working Hours per Day</Text>
          <Text style={styles.valueCell}>{data.inputs.workHours}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Working Days per Month</Text>
          <Text style={styles.valueCell}>{data.inputs.workDays}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Current Operator Efficiency (%)</Text>
          <Text style={styles.valueCell}>{data.inputs.currentOperEfficiency}%</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Target Operator Efficiency (%)</Text>
          <Text style={styles.valueCell}>{data.inputs.newOperEfficiency}%</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Selling Price per Garment ($)</Text>
          <Text style={styles.valueCell}>${data.inputs.price}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Cost per Garment ($)</Text>
          <Text style={styles.valueCell}>${data.inputs.cost}</Text>
        </View>
      </View>

      {/* Calculation Results Section */}
      <Text style={styles.sectionTitle}>Calculation Results</Text>
      <View style={styles.resultTable}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.paramCell}>Metric</Text>
          <Text style={styles.valueCell}>Value</Text>
        </View>
        
        {/* Result Rows */}
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Current Daily Production (per line)</Text>
          <Text style={styles.valueCell}>{data.currentDailyProduction.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>New Daily Production (per line)</Text>
          <Text style={styles.valueCell}>{data.newDailyProduction.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Total Current Daily Production</Text>
          <Text style={styles.valueCell}>{data.totDailyProduction.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Total New Daily Production</Text>
          <Text style={styles.valueCell}>{data.totNewDailyProduction.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Garments per Day</Text>
          <Text style={styles.valueCell}>{data.additionalGarmentPerDay.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Garments per Month</Text>
          <Text style={styles.valueCell}>{data.additionalGarmentPerMonth.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Revenue per Month ($)</Text>
          <Text style={styles.valueCell}>${data.additionalRevenuePerMonth.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Cost per Month ($)</Text>
          <Text style={styles.valueCell}>${data.additionalCostPerMonth.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Profit per Month ($)</Text>
          <Text style={styles.valueCell}>${data.additionalProfitPerMonth.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.paramCell}>Additional Profit per Year ($)</Text>
          <Text style={styles.valueCell}>${data.additionalProfitPerYear.toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Generated on: {moment().tz("Asia/Dhaka").format('YYYY-MM-DD, h:mm:ss a')}
        </Text>
        <Text style={styles.footerText}>https://eliot.global</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);