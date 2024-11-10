using Microsoft.Extensions.Configuration;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;

namespace OM_ScheduleTool.ViewModels
{
    public class ExcelExportHelper
    {
        public static string ExcelContentType
        {
            get
            { return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
        }

        public static DataTable ListToDataTable<T>(List<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable dataTable = new DataTable();

            for (int i = 0; i < properties.Count; i++)
            {
                PropertyDescriptor property = properties[i];
                dataTable.Columns.Add(property.Name, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
            }

            object[] values = new object[properties.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = properties[i].GetValue(item);
                }

                dataTable.Rows.Add(values);
            }
            return dataTable;
        }

        public static byte[] ExportExcel(DataTable dataTable, string heading = "", bool showSrNo = false, params string[] columnsToTake)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(String.Format("{0} Data", heading));

                int startRowFrom = String.IsNullOrEmpty(heading) ? 1 : 3;

                if (showSrNo)
                {
                    DataColumn dataColumn = dataTable.Columns.Add("#", typeof(int));
                    dataColumn.SetOrdinal(0);
                    int index = 1;
                    foreach (DataRow item in dataTable.Rows)
                    {
                        item[0] = index;
                        index++;
                    }
                }

                // add the content into the Excel file  
                workSheet.Cells["A" + startRowFrom].LoadFromDataTable(dataTable, true);

                // autofit width of cells with small content  
                int columnIndex = 1;
                foreach (DataColumn column in dataTable.Columns)
                {
                    ExcelRange columnCells = workSheet.Cells[workSheet.Dimension.Start.Row, columnIndex, workSheet.Dimension.End.Row, columnIndex];
                    int maxLength = columnCells.Max(cell => cell.Value.ToString().Count());
                    if (maxLength < 150)
                    {
                        workSheet.Column(columnIndex).AutoFit();
                    }


                    columnIndex++;
                }

                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[startRowFrom, 1, startRowFrom, dataTable.Columns.Count])
                {
                    r.Style.Font.Color.SetColor(System.Drawing.Color.White);
                    r.Style.Font.Bold = true;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#1fb5ad"));
                }

                // format cells - add borders  
                using (ExcelRange r = workSheet.Cells[startRowFrom + 1, 1, startRowFrom + dataTable.Rows.Count, dataTable.Columns.Count])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }

                // removed ignored columns  
                for (int i = dataTable.Columns.Count - 1; i >= 0; i--)
                {
                    if (i == 0 && showSrNo)
                    {
                        continue;
                    }
                    if (!columnsToTake.Contains(dataTable.Columns[i].ColumnName))
                    {
                        workSheet.DeleteColumn(i + 1);
                    }
                }

                if (!String.IsNullOrEmpty(heading))
                {
                    workSheet.Cells["A1"].Value = heading;
                    workSheet.Cells["A1"].Style.Font.Size = 20;

                    workSheet.InsertColumn(1, 1);
                    workSheet.InsertRow(1, 1);
                    workSheet.Column(1).Width = 5;
                }

                result = package.GetAsByteArray();
            }

            return result;
        }

        public static byte[] ExportExcel(NetworkViewModel nvm)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Networks");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Country";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Network Name";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Alias";

                foreach (NetworkAlias na in nvm.Networks)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = na.Country;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = na.NetworkName;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = na.Alias;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();

                result = package.GetAsByteArray();
            }

            return result;
        }

        public static byte[] ExportExcel(ExcelExportPostLogViewModel plvm)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("PostLog");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Country";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Client";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "Date";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Time";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "ISCI";

                foreach (ExportPostLog exp in plvm.ExportPostLogs)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = exp.Country;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = exp.Client;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = exp.Network;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = exp.FullRate;
                    workSheet.Cells["D" + DataRowStart.ToString()].Style.Numberformat.Format = "$#,##0.00";
                    workSheet.Cells["E" + DataRowStart.ToString()].Value = exp.SpotDate;
                    workSheet.Cells["E" + DataRowStart.ToString()].Style.Numberformat.Format = "mm/dd/yyyy";
                    workSheet.Cells["F" + DataRowStart.ToString()].Value = exp.SpotTime.ToLongTimeString();
                    workSheet.Cells["G" + DataRowStart.ToString()].Value = exp.ISCI;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();
                workSheet.Column(4).AutoFit();
                workSheet.Column(5).AutoFit();
                workSheet.Column(6).AutoFit();
                workSheet.Column(7).AutoFit();

                result = package.GetAsByteArray();
            }

            return result;
        }

        /*
         *  Manage Media Main Screen - Upfronts Tab DISPLAY UPFRONTS Export to Excel
         * */
        public static byte[] ExportExcel(DisplayUpfrontsViewModel duf)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("PostLog");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Country";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Upfront Name";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Network Name";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Buyer";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "Quarter";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Status";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "Last Update";

                foreach (Upfront upfront in duf.Upfronts)
                {
                    try
                    {
                        DataRowStart++;
                        workSheet.Cells["A" + DataRowStart.ToString()].Value = upfront.Network.Country.CountryShort;
                        workSheet.Cells["B" + DataRowStart.ToString()].Value = upfront.Name;
                        workSheet.Cells["C" + DataRowStart.ToString()].Value = upfront.Network.StdNetName;
                        workSheet.Cells["D" + DataRowStart.ToString()].Value = (upfront.BuyerName != null ? upfront.BuyerName.LastName : "");
                        workSheet.Cells["E" + DataRowStart.ToString()].Value = upfront.Quarter.QuarterName;
                        if (upfront.UpfrontLockedDate == null)
                        {
                            workSheet.Cells["F" + DataRowStart.ToString()].Value = "Not Locked";
                        }
                        else
                        {
                            workSheet.Cells["F" + DataRowStart.ToString()].Value = "Locked " + ((DateTime)upfront.UpfrontLockedDate).ToString("MM/dd/yyyy HH:mm tt") + upfront.UpfrontLockedBy.DisplayName;
                        }
                        workSheet.Cells["G" + DataRowStart.ToString()].Value = upfront.UpdateDt.ToString("MM/dd/yyyy HH:mm tt");
                    }
                    catch { }
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();
                workSheet.Column(4).AutoFit();
                workSheet.Column(5).AutoFit();
                workSheet.Column(6).AutoFit();
                workSheet.Column(7).AutoFit();

                result = package.GetAsByteArray();
            }

            return result;
        }


        public static byte[] ExportExcel(UpfrontReportViewModel urvm)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(urvm.NetworkInfo.StdNetName);
                workSheet.View.ShowGridLines = false;

                workSheet.PrinterSettings.PaperSize = ePaperSize.A4;
                workSheet.PrinterSettings.Orientation = eOrientation.Landscape;
                workSheet.PrinterSettings.HorizontalCentered = true;
                workSheet.PrinterSettings.FitToPage = true;
                workSheet.PrinterSettings.FitToWidth = 1;
                workSheet.PrinterSettings.FitToHeight = 0;

                int colCount = 25;
                if (urvm.IsDRBT) { colCount = 23; }
                // Header
                using (ExcelRange rHeader = workSheet.Cells[1, 1, 1, colCount])
                {
                    rHeader.Merge = true;
                    rHeader.Value = urvm.ReportName;
                }

                using (ExcelRange rNetworkName = workSheet.Cells[3, 1, 3, 13])
                {
                    rNetworkName.Merge = true;
                    rNetworkName.Value = urvm.NetworkInfo.StdNetName;
                    rNetworkName.Style.Font.Size = 18.0f;
                    rNetworkName.Style.Font.Bold = true;
                }

                using (ExcelRange rQuarter = workSheet.Cells[5, 1, 5, 13])
                {
                    rQuarter.Merge = true;
                    rQuarter.Value = "Quarter:  " + urvm.Quarter;
                }

                using (ExcelRange rMedia = workSheet.Cells[6, 1, 6, 13])
                {
                    rMedia.Merge = true;
                    rMedia.Value = "Media:  " + urvm.Media;
                }

                using (ExcelRange rFeedType = workSheet.Cells[7, 1, 7, 13])
                {
                    rFeedType.Merge = true;
                    rFeedType.Value = "Feed:  " + urvm.FeedType;
                }

                using (ExcelRange rGuaranteed = workSheet.Cells[8, 1, 8, 13])
                {
                    rGuaranteed.Merge = true;
                    rGuaranteed.Value = "Guaranteed:  " + urvm.Guaranteed;
                }

                using (ExcelRange rBusiness = workSheet.Cells[3, 14, 3, colCount])
                {
                    rBusiness.Merge = true;
                    rBusiness.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rBusiness.Value = urvm.BusinessName;
                    rBusiness.Style.Font.Size = 18.0f;
                    rBusiness.Style.Font.Bold = true;
                }

                using (ExcelRange rStreet1 = workSheet.Cells[5, 14, 5, colCount])
                {
                    rStreet1.Merge = true;
                    rStreet1.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rStreet1.Value = urvm.BusinessStreet1;
                }

                using (ExcelRange rCity = workSheet.Cells[6, 14, 6, colCount])
                {
                    rCity.Merge = true;
                    rCity.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rCity.Value = urvm.BusinessCity + ", " + urvm.BusinessState + " " + urvm.BusinessZip;
                }

                using (ExcelRange rPhone = workSheet.Cells[7, 14, 7, colCount])
                {
                    rPhone.Merge = true;
                    rPhone.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rPhone.Value = urvm.BusinessPhone;
                }

                using (ExcelRange rEmail = workSheet.Cells[8, 14, 8, colCount])
                {
                    rEmail.Merge = true;
                    rEmail.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rEmail.Value = urvm.LoggedOnUser.EmailAddress;
                }

                // Upfront / Remnant Lines
                // Grid Header
                workSheet.Cells["A10"].Value = "PROPERTY";
                workSheet.Cells["B10"].Value = "M";
                workSheet.Cells["C10"].Value = "T";
                workSheet.Cells["D10"].Value = "W";
                workSheet.Cells["E10"].Value = "T";
                workSheet.Cells["F10"].Value = "F";
                workSheet.Cells["G10"].Value = "S";
                workSheet.Cells["H10"].Value = "S";
                workSheet.Cells["I10"].Value = "STARTTIME";
                workSheet.Cells["J10"].Value = "ENDTIME";
                workSheet.Cells["K10"].Value = "BUY TYPE";
                workSheet.Cells["L10"].Value = "DAY PART";
                workSheet.Cells["M10"].Value = "LEN";
                workSheet.Cells["N10"].Value = "SPLIT";
                workSheet.Cells["O10"].Value = "DEMO";
                workSheet.Cells["P10"].Value = "POP";
                workSheet.Cells["Q10"].Value = "RATE";
                if (!urvm.IsDRBT)
                {
                    workSheet.Cells["R10"].Value = "IMP";
                    workSheet.Cells["S10"].Value = "CPM";
                    workSheet.Cells["T10"].Value = "APPROVAL";
                    workSheet.Cells["U10"].Value = "STATUS";
                    workSheet.Cells["V10"].Value = "MANDATE CLIENT";
                    workSheet.Cells["W10"].Value = "EFF DT";
                    workSheet.Cells["X10"].Value = "EXP DT";
                    workSheet.Cells["Y10"].Value = "REV #";
                }
                else
                {
                    workSheet.Cells["R10"].Value = "APPROVAL";
                    workSheet.Cells["S10"].Value = "STATUS";
                    workSheet.Cells["T10"].Value = "MANDATE CLIENT";
                    workSheet.Cells["U10"].Value = "EFF DT";
                    workSheet.Cells["V10"].Value = "EXP DT";
                    workSheet.Cells["W10"].Value = "REV #";
                }


                workSheet.Row(10).Height = workSheet.Row(10).Height * 2;
                workSheet.Row(10).Style.WrapText = true;
                workSheet.Row(10).Style.Font.Bold = true;

                workSheet.Column(1).Width = 20.0;
                workSheet.Column(2).Width = 3.0;
                workSheet.Column(3).Width = 3.0;
                workSheet.Column(4).Width = 3.0;
                workSheet.Column(5).Width = 3.0;
                workSheet.Column(6).Width = 3.0;
                workSheet.Column(7).Width = 3.0;
                workSheet.Column(8).Width = 3.0;
                workSheet.Column(9).Width = 12.0;
                workSheet.Column(10).Width = 12.0;
                workSheet.Column(11).Width = 7.0;
                workSheet.Column(12).Width = 7.0;
                workSheet.Column(13).Width = 5.0;
                workSheet.Column(14).Width = 6.0;
                workSheet.Column(15).Width = 14.0;
                workSheet.Column(16).Width = 14.0;
                workSheet.Column(17).Width = 14.0;
                if (!urvm.IsDRBT)
                {
                    workSheet.Column(18).Width = 14.0;
                    workSheet.Column(19).Width = 14.0;
                    workSheet.Column(20).Width = 14.0;
                    workSheet.Column(21).Width = 14.0;
                    workSheet.Column(22).Width = 14.0;
                    workSheet.Column(23).Width = 14.0;
                    workSheet.Column(24).Width = 14.0;
                    workSheet.Column(25).Width = 5.0;
                }
                else
                {
                    workSheet.Column(18).Width = 14.0;
                    workSheet.Column(19).Width = 14.0;
                    workSheet.Column(20).Width = 14.0;
                    workSheet.Column(21).Width = 14.0;
                    workSheet.Column(22).Width = 14.0;
                    workSheet.Column(23).Width = 5.0;
                }


                int DataRowStart = 10;
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.WrapText = true;
                }

                DataRowStart++;
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart + urvm.UpfrontLines.Count() - 1, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.WrapText = true;
                }
                foreach (var upfrontline in urvm.UpfrontLines)
                {
                    if (upfrontline.BuyTypeCode == "A" && upfrontline.SpotLen == 30)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#fff0c3"));
                        }
                    }
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = upfrontline.PropertyName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = (upfrontline.Monday == true ? "X" : "");
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = (upfrontline.Tuesday == true ? "X" : "");
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = (upfrontline.Wednesday == true ? "X" : "");
                    workSheet.Cells["E" + DataRowStart.ToString()].Value = (upfrontline.Thursday == true ? "X" : "");
                    workSheet.Cells["F" + DataRowStart.ToString()].Value = (upfrontline.Friday == true ? "X" : "");
                    workSheet.Cells["G" + DataRowStart.ToString()].Value = (upfrontline.Saturday == true ? "X" : "");
                    workSheet.Cells["H" + DataRowStart.ToString()].Value = (upfrontline.Sunday == true ? "X" : "");
                    workSheet.Cells["I" + DataRowStart.ToString()].Value = upfrontline.StartTime.ToShortTimeString();
                    workSheet.Cells["J" + DataRowStart.ToString()].Value = upfrontline.EndTime.ToShortTimeString();
                    workSheet.Cells["K" + DataRowStart.ToString()].Value = upfrontline.BuyTypeCode;
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = upfrontline.DayPartCd;
                    workSheet.Cells["M" + DataRowStart.ToString()].Value = upfrontline.SpotLen;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = upfrontline.SplitNo;
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = upfrontline.DemoName;
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = upfrontline.Universe;
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = upfrontline.RateAmt.ToString("c0");
                    if (!urvm.IsDRBT)
                    {
                        workSheet.Cells["R" + DataRowStart.ToString()].Value = upfrontline.Impressions.ToString("n0");
                        workSheet.Cells["S" + DataRowStart.ToString()].Value = upfrontline.CPM.ToString("c2");
                        workSheet.Cells["T" + DataRowStart.ToString()].Value = (upfrontline.Approved == true ? "APPROVED" : "NOT APPROVED");
                        workSheet.Cells["U" + DataRowStart.ToString()].Value = upfrontline.DoNotBuyTypeDescription;
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = upfrontline.MandateClientName;
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = upfrontline.EffectiveDate.ToShortDateString();
                        workSheet.Cells["X" + DataRowStart.ToString()].Value = upfrontline.ExpirationDate.ToShortDateString();
                        workSheet.Cells["Y" + DataRowStart.ToString()].Value = upfrontline.Revision;
                    }
                    else
                    {
                        workSheet.Cells["R" + DataRowStart.ToString()].Value = (upfrontline.Approved == true ? "APPROVED" : "NOT APPROVED");
                        workSheet.Cells["S" + DataRowStart.ToString()].Value = upfrontline.DoNotBuyTypeDescription;
                        workSheet.Cells["T" + DataRowStart.ToString()].Value = upfrontline.MandateClientName;
                        workSheet.Cells["U" + DataRowStart.ToString()].Value = upfrontline.EffectiveDate.ToShortDateString();
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = upfrontline.ExpirationDate.ToShortDateString();
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = upfrontline.Revision;
                    }

                    DataRowStart++;
                }

                // Footer 
                DataRowStart = DataRowStart + 2;

                workSheet.Cells["A" + DataRowStart.ToString()].Value = "NATIONAL BREAKS";
                workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                if (urvm.IsDRBuyType)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "No more than 1 spot per 30 minutes.";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "Notwithstanding anything herein or elsewhere contained to the company,";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.NetworkInfo.StdNetName + " acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.NetworkInfo.StdNetName + " unless and until said principal has paid Ocean Media";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                else
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "Billboard Added Value:";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.DealPointInfo.BillboardAddedValue;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "Upfront Sponsorship:";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.DealPointInfo.UpfrontSponsorship;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                using (ExcelRange rSigLine = workSheet.Cells[DataRowStart, 1, DataRowStart, 19])
                {
                    rSigLine.Merge = true;
                    rSigLine.Value = "";
                    rSigLine.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    rSigLine.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                }

                using (ExcelRange rDateLine = workSheet.Cells[DataRowStart, 21, DataRowStart, colCount])
                {
                    rDateLine.Merge = true;
                    rDateLine.Value = "";
                    rDateLine.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    rDateLine.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                }

                DataRowStart++;
                using (ExcelRange rSigLineText = workSheet.Cells[DataRowStart, 1, DataRowStart, 19])
                {
                    rSigLineText.Merge = true;
                    rSigLineText.Value = "Signature";
                }

                using (ExcelRange rDateLineText = workSheet.Cells[DataRowStart, 21, DataRowStart, colCount])
                {
                    rDateLineText.Merge = true;
                    rDateLineText.Value = "Date";
                }

                if (!urvm.IsDRBuyType)
                {
                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "UPFRONT CANCELLATION:";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.DealPointInfo.UpfrontCancellation;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "SCATTER CANCELLATION:";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.DealPointInfo.ScatterCancellation;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "NETWORK SEPARATION POLICY:";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.DealPointInfo.NetworkSeparationPolicy;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "All paid spots are non pre - emptible unless approved by Ocean Media prior to pre-emption.";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "No more than 1 spot per program.";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "Not withstanding anything herein or elsewhere contained to the company, ";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = urvm.NetworkInfo.StdNetName + " acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to " + urvm.NetworkInfo.StdNetName + " unless and until said principal has paid Ocean Media.";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                else
                {
                    DataRowStart++;
                    DataRowStart++;

                    workSheet.Cells["A" + DataRowStart.ToString()].Value = "SCATTER CANCELLATION: Five Business Days Cancel";
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Bold = true;
                    workSheet.Cells["A" + DataRowStart.ToString()].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                DataRowStart++;
                DataRowStart++;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Comments:  ";

                DataRowStart++;
                using (ExcelRange rComments = workSheet.Cells[DataRowStart, 1, DataRowStart + 4, colCount])
                {
                    rComments.Merge = true;

                    rComments.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    rComments.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }

                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                using (ExcelRange rFooter = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    rFooter.Merge = true;
                    rFooter.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    rFooter.Style.Font.Italic = true;
                    rFooter.Style.Font.Color.SetColor(System.Drawing.Color.Gray);
                    rFooter.Value = "Thank you very much for doing business with us.We look forward to working with you again!";
                }

                DataRowStart++;
                using (ExcelRange rFooter = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    rFooter.Merge = true;
                    rFooter.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    rFooter.Style.Font.Italic = true;
                    rFooter.Style.Font.Color.SetColor(System.Drawing.Color.Gray);
                    rFooter.Value = "Proposal Generated on:  " + DateTime.Now.ToLongDateString() + " " + DateTime.Now.ToShortTimeString() + " by " + urvm.LoggedOnUser.DisplayName;
                }

                /*                workSheet.Cells["A1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                                */


                /*
                int startRowFrom = String.IsNullOrEmpty(heading) ? 1 : 3;

                if (showSrNo)
                {
                    DataColumn dataColumn = dataTable.Columns.Add("#", typeof(int));
                    dataColumn.SetOrdinal(0);
                    int index = 1;
                    foreach (DataRow item in dataTable.Rows)
                    {
                        item[0] = index;
                        index++;
                    }
                }


                // add the content into the Excel file  
                workSheet.Cells["A" + startRowFrom].LoadFromDataTable(dataTable, true);

                // autofit width of cells with small content  
                int columnIndex = 1;
                foreach (DataColumn column in dataTable.Columns)
                {
                    ExcelRange columnCells = workSheet.Cells[workSheet.Dimension.Start.Row, columnIndex, workSheet.Dimension.End.Row, columnIndex];
                    int maxLength = columnCells.Max(cell => cell.Value.ToString().Count());
                    if (maxLength < 150)
                    {
                        workSheet.Column(columnIndex).AutoFit();
                    }


                    columnIndex++;
                }

                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[startRowFrom, 1, startRowFrom, dataTable.Columns.Count])
                {
                    r.Style.Font.Color.SetColor(System.Drawing.Color.White);
                    r.Style.Font.Bold = true;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#1fb5ad"));
                }

                // format cells - add borders  
                using (ExcelRange r = workSheet.Cells[startRowFrom + 1, 1, startRowFrom + dataTable.Rows.Count, dataTable.Columns.Count])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }

                // removed ignored columns  
                for (int i = dataTable.Columns.Count - 1; i >= 0; i--)
                {
                    if (i == 0 && showSrNo)
                    {
                        continue;
                    }
                    if (!columnsToTake.Contains(dataTable.Columns[i].ColumnName))
                    {
                        workSheet.DeleteColumn(i + 1);
                    }
                }

                if (!String.IsNullOrEmpty(heading))
                {
                    workSheet.Cells["A1"].Value = heading;
                    workSheet.Cells["A1"].Style.Font.Size = 20;

                    workSheet.InsertColumn(1, 1);
                    workSheet.InsertRow(1, 1);
                    workSheet.Column(1).Width = 5;
                }

                */
                result = package.GetAsByteArray();
            }

            return result;
        }

        public static byte[] ExportExcel(DisplaySchedulesViewModel urvm)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            return result;
        }

        public static byte[] ExportExcel<T>(List<T> data, string Heading = "", bool showSlno = false, params string[] ColumnsToTake)
        {
            return ExportExcel(ListToDataTable<T>(data), Heading, showSlno, ColumnsToTake);
        }

        public static byte[] ExportExcel(ClientViewModel clientViewModel)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("All Clients and Aliases");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Country";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Client Name";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Alias";

                foreach (ClientAlias objClientAlias in clientViewModel.ClientAliases)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = objClientAlias.Country;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = objClientAlias.ClientName;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = objClientAlias.Alias;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();

                workSheet.Cells[1, 1, 1, 3].AutoFilter = true;
                result = package.GetAsByteArray();
            }

            return result;
        }

        public static byte[] ExportExcel(DemographicSettingsViewModel demographicSettingsViewModel)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Demographics Settings");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Country";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Plan Year";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Demo Name";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Universe";

                foreach (DemographicSettingsExport objDemographicSettingsExport in demographicSettingsViewModel.lstDemographicSettingsExport)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = objDemographicSettingsExport.Country;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = objDemographicSettingsExport.PlanYear;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = objDemographicSettingsExport.DemoName;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = objDemographicSettingsExport.Universe;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();
                workSheet.Column(4).AutoFit();

                result = package.GetAsByteArray();
            }
            return result;
        }

        public static byte[] ExportExcel(CanadianExchangeViewModel canadianExchangeViewModel)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Candian Client Exchange");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Client";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Year";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Quarter";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Rate";

                foreach (CanadaClientExchangeRateExport objCanadaClientExchangeRateExport in canadianExchangeViewModel.ListCanadaClientExchangeRateExport)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = objCanadaClientExchangeRateExport.Client;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = objCanadaClientExchangeRateExport.Year;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = objCanadaClientExchangeRateExport.Quarter;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = objCanadaClientExchangeRateExport.Rate;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();
                workSheet.Column(4).AutoFit();

                result = package.GetAsByteArray();
            }
            return result;
        }

        public static byte[] ExportExcel(ClientCommissionViewModel clientCommissionViewModel)
        {
            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Client Commission Rate");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Client";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Year";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Quarter";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Week";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Country";

                foreach (ClientCommissionRateExport objClientCommissionRateExport in clientCommissionViewModel.ListClientCommissionRateExport)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = objClientCommissionRateExport.ClientName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = objClientCommissionRateExport.Year;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = objClientCommissionRateExport.Quarter;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = objClientCommissionRateExport.Week;
                    workSheet.Cells["E" + DataRowStart.ToString()].Value = objClientCommissionRateExport.Rate;
                    workSheet.Cells["F" + DataRowStart.ToString()].Value = objClientCommissionRateExport.Country;
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(3).AutoFit();
                workSheet.Column(4).AutoFit();
                workSheet.Column(5).AutoFit();
                workSheet.Column(6).AutoFit();

                result = package.GetAsByteArray();
            }
            return result;
        }

        public static byte[] ExportExcel(ProposalReportViewModel prvm)
        {

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            byte[] result = null;
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(prvm.ProposalInfo.Client.ClientName);
                workSheet.View.ShowGridLines = false;

                workSheet.PrinterSettings.PaperSize = ePaperSize.A4;
                workSheet.PrinterSettings.Orientation = eOrientation.Landscape;
                workSheet.PrinterSettings.HorizontalCentered = true;
                workSheet.PrinterSettings.FitToPage = true;
                workSheet.PrinterSettings.FitToWidth = 1;
                workSheet.PrinterSettings.FitToHeight = 0;

                int colCount = 17;
                if (prvm.IsDRBT) { colCount = 15; }
                if (prvm.Quarter.Wk01_Date != null) { colCount++; }
                if (prvm.Quarter.Wk02_Date != null) { colCount++; }
                if (prvm.Quarter.Wk03_Date != null) { colCount++; }
                if (prvm.Quarter.Wk04_Date != null) { colCount++; }
                if (prvm.Quarter.Wk05_Date != null) { colCount++; }
                if (prvm.Quarter.Wk06_Date != null) { colCount++; }
                if (prvm.Quarter.Wk07_Date != null) { colCount++; }
                if (prvm.Quarter.Wk08_Date != null) { colCount++; }
                if (prvm.Quarter.Wk09_Date != null) { colCount++; }
                if (prvm.Quarter.Wk10_Date != null) { colCount++; }
                if (prvm.Quarter.Wk11_Date != null) { colCount++; }
                if (prvm.Quarter.Wk12_Date != null) { colCount++; }
                if (prvm.Quarter.Wk13_Date != null) { colCount++; }
                if (prvm.Quarter.Wk14_Date != null) { colCount++; }


                using (ExcelRange rHeader = workSheet.Cells[1, 1, 1, colCount])
                {
                    rHeader.Merge = true;
                    rHeader.Value = prvm.ReportName;
                }

                using (ExcelRange rNetworkName = workSheet.Cells[3, 1, 3, (int)(colCount / 2) - 2])
                {
                    rNetworkName.Merge = true;
                    rNetworkName.Value = prvm.ProposalInfo.Client.ClientName;
                    rNetworkName.Style.Font.Size = 18.0f;
                    rNetworkName.Style.Font.Bold = true;
                }

                using (ExcelRange rNetworkName = workSheet.Cells[5, 1, 5, (int)(colCount / 2) - 2])
                {
                    rNetworkName.Merge = true;
                    rNetworkName.Value = prvm.NetworkInfo.StdNetName;
                    rNetworkName.Style.Font.Size = 18.0f;
                    rNetworkName.Style.Font.Bold = true;
                }

                using (ExcelRange rQuarter = workSheet.Cells[7, 1, 7, (int)(colCount / 2) - 2])
                {
                    rQuarter.Merge = true;
                    rQuarter.Value = "Quarter:  " + prvm.Quarter.QuarterName;
                }

                using (ExcelRange rMedia = workSheet.Cells[8, 1, 8, (int)(colCount / 2) - 2])
                {
                    rMedia.Merge = true;
                    rMedia.Value = "Media:  " + prvm.Media;
                }

                using (ExcelRange rFeedType = workSheet.Cells[9, 1, 9, (int)(colCount / 2) - 2])
                {
                    rFeedType.Merge = true;
                    rFeedType.Value = "Feed:  " + prvm.FeedType;
                }

                using (ExcelRange rGuaranteed = workSheet.Cells[10, 1, 10, (int)(colCount / 2) - 2])
                {
                    rGuaranteed.Merge = true;
                    rGuaranteed.Value = "Guaranteed:  " + prvm.Guaranteed;
                }

                using (ExcelRange rBusiness = workSheet.Cells[5, (int)(colCount / 2) + 3, 5, colCount])
                {
                    rBusiness.Merge = true;
                    rBusiness.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rBusiness.Value = prvm.BusinessName;
                    rBusiness.Style.Font.Size = 18.0f;
                    rBusiness.Style.Font.Bold = true;
                }

                using (ExcelRange rStreet1 = workSheet.Cells[7, (int)(colCount / 2) + 3, 7, colCount])
                {
                    rStreet1.Merge = true;
                    rStreet1.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rStreet1.Value = prvm.BusinessStreet1;
                }

                using (ExcelRange rCity = workSheet.Cells[8, (int)(colCount / 2) + 3, 8, colCount])
                {
                    rCity.Merge = true;
                    rCity.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rCity.Value = prvm.BusinessCity + ", " + prvm.BusinessState + " " + prvm.BusinessZip;
                }

                using (ExcelRange rPhone = workSheet.Cells[9, (int)(colCount / 2) + 3, 9, colCount])
                {
                    rPhone.Merge = true;
                    rPhone.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rPhone.Value = prvm.BusinessPhone;
                }

                using (ExcelRange rEmail = workSheet.Cells[10, (int)(colCount / 2) + 3, 10, colCount])
                {
                    rEmail.Merge = true;
                    rEmail.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    rEmail.Value = prvm.LoggedOnUser.EmailAddress;
                }

                int DataRowStart = 12;
                int col = 16;
                if (prvm.IsDRBT) { col = 14; }
                workSheet.Cells[DataRowStart, col].Value = "TOTALS"; workSheet.Column(col).Width = 12.0;
                col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.QuarterName; workSheet.Column(col).Width = 12.0;
                if (prvm.Quarter.Wk01_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk01_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk02_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk02_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk03_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk03_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk04_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk04_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk05_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk05_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk06_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk06_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk07_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk07_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk08_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk08_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk09_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk09_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk10_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk10_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk11_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk11_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk12_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk12_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk13_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk13_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }
                if (prvm.Quarter.Wk14_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk14_Date.Value.ToShortDateString(); workSheet.Column(col).Width = 12.0; }


                using (ExcelRange r = workSheet.Cells[DataRowStart, prvm.IsDRBT ? 14 : 16, DataRowStart, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                }
                workSheet.Row(DataRowStart).Height = workSheet.Row(DataRowStart).Height * 2;
                workSheet.Row(DataRowStart).Style.Font.Bold = true;

                DataRowStart++;
                foreach (var total in prvm.ProposalLinesFlatTotals)
                {
                    col = 16;
                    if (prvm.IsDRBT) { col = 14; }
                    workSheet.Cells[DataRowStart, col].Value = total.Description;
                    col++; workSheet.Cells[DataRowStart, col].Value = total.Total;
                    if (prvm.Quarter.Wk01_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk01; }
                    if (prvm.Quarter.Wk02_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk02; }
                    if (prvm.Quarter.Wk03_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk03; }
                    if (prvm.Quarter.Wk04_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk04; }
                    if (prvm.Quarter.Wk05_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk05; }
                    if (prvm.Quarter.Wk06_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk06; }
                    if (prvm.Quarter.Wk07_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk07; }
                    if (prvm.Quarter.Wk08_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk08; }
                    if (prvm.Quarter.Wk09_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk09; }
                    if (prvm.Quarter.Wk10_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk10; }
                    if (prvm.Quarter.Wk11_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk11; }
                    if (prvm.Quarter.Wk12_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk12; }
                    if (prvm.Quarter.Wk13_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk13; }
                    if (prvm.Quarter.Wk14_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = total.Wk14; }
                    DataRowStart++;
                }

                using (ExcelRange r = workSheet.Cells[13, prvm.IsDRBT ? 14 : 16, DataRowStart - 1, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.WrapText = true;
                }


                col = 1;
                DataRowStart++;
                workSheet.Cells[DataRowStart, col].Value = "PROPERTY"; workSheet.Column(col).Width = 20.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "M"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "T"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "W"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "T"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "F"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "S"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "S"; workSheet.Column(col).Width = 3.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "STARTTIME-ENDTIME"; workSheet.Column(col).Width = 18.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "BUY TYPE"; workSheet.Column(col).Width = 7.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "DAY PART"; workSheet.Column(col).Width = 7.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "LEN"; workSheet.Column(col).Width = 5.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "DEMO"; workSheet.Column(col).Width = 14.0;
                col++; workSheet.Cells[DataRowStart, col].Value = "RATE"; workSheet.Column(col).Width = 14.0;
                if (!prvm.IsDRBT)
                {
                    col++; workSheet.Cells[DataRowStart, col].Value = "IMP"; workSheet.Column(col).Width = 14.0;
                    col++; workSheet.Cells[DataRowStart, col].Value = "CPM"; workSheet.Column(col).Width = 14.0;
                }
                col++; workSheet.Cells[DataRowStart, col].Value = "TOTAL SPOTS"; workSheet.Column(col).Width = 14.0;
                if (prvm.Quarter.Wk01_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk01_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk02_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk02_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk03_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk03_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk04_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk04_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk05_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk05_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk06_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk06_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk07_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk07_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk08_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk08_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk09_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk09_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk10_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk10_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk11_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk11_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk12_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk12_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk13_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk13_Date.Value.ToShortDateString(); }
                if (prvm.Quarter.Wk14_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = prvm.Quarter.Wk14_Date.Value.ToShortDateString(); }

                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.WrapText = true;
                }
                workSheet.Row(DataRowStart).Height = workSheet.Row(DataRowStart).Height * 2;
                workSheet.Row(DataRowStart).Style.WrapText = true;
                workSheet.Row(DataRowStart).Style.Font.Bold = true;

                DataRowStart++;
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart + prvm.ProposalLines.Count() - 1, colCount])
                {
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.LightGray);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.LightGray);

                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.WrapText = true;
                }


                foreach (var proposalLine in prvm.ProposalLines)
                {
                    col = 1;
                    if (proposalLine.BuyTypeCode == "A" && proposalLine.SpotLen == 30)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, col, DataRowStart, colCount])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#fff0c3"));
                        }
                    }
                    //  ST-1011 Highlighting 15 sec cell
                    if (proposalLine.SpotLen == 15)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 12, DataRowStart, 12])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#A6C9EC"));
                        }
                    }
                    workSheet.Cells[DataRowStart, col].Value = proposalLine.PropertyName;
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Monday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Tuesday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Wednesday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Thursday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Friday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Saturday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = (proposalLine.Sunday == true ? "X" : "");
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.StartToEndTime;
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.BuyTypeCode;
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.DayPartCd;
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.SpotLen;
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.DemoName;
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.RateAmt.ToString("c2");
                    if (!prvm.IsDRBT)
                    {
                        col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Impressions.ToString("n0");
                        col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.CPM.ToString("c2");
                    }
                    // Changing color for DOW if it is changed
                    if(proposalLine.IsDowChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 2, DataRowStart, 8])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    // Changing color for Start and End time if it is changed
                    if (proposalLine.IsTimeChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 9, DataRowStart, 9])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    
                    col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.TotalSpots;
                    if (prvm.Quarter.Wk01_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk01_Spots; }
                    if (prvm.Quarter.Wk02_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk02_Spots; }
                    if (prvm.Quarter.Wk03_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk03_Spots; }
                    if (prvm.Quarter.Wk04_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk04_Spots; }
                    if (prvm.Quarter.Wk05_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk05_Spots; }
                    if (prvm.Quarter.Wk06_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk06_Spots; }
                    if (prvm.Quarter.Wk07_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk07_Spots; }
                    if (prvm.Quarter.Wk08_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk08_Spots; }
                    if (prvm.Quarter.Wk09_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk09_Spots; }
                    if (prvm.Quarter.Wk10_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk10_Spots; }
                    if (prvm.Quarter.Wk11_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk11_Spots; }
                    if (prvm.Quarter.Wk12_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk12_Spots; }
                    if (prvm.Quarter.Wk13_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk13_Spots; }
                    if (prvm.Quarter.Wk14_Date != null) { col++; workSheet.Cells[DataRowStart, col].Value = proposalLine.Wk14_Spots; }

                    DataRowStart++;
                }

                col = 1;
                DataRowStart = DataRowStart + 2;

                workSheet.Cells[DataRowStart, col].Value = "NATIONAL BREAKS";
                workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                if (prvm.IsDRBuyType)
                {
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "No more than 1 spot per 30 minutes.";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "Notwithstanding anything herein or elsewhere contained to the company,";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = prvm.NetworkInfo.StdNetName + " acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = prvm.NetworkInfo.StdNetName + " unless and until said principal has paid Ocean Media";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                else
                {
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "Billboard Added Value:";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    workSheet.Cells[DataRowStart, col + 5].Value = prvm.DealPointInfo.BillboardAddedValue;
                    workSheet.Cells[DataRowStart, col + 5].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "Upfront Sponsorship:";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    workSheet.Cells[DataRowStart, col + 5].Value = prvm.DealPointInfo.UpfrontSponsorship;
                    workSheet.Cells[DataRowStart, col + 5].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                }
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                using (ExcelRange rSigLine = workSheet.Cells[DataRowStart, col, DataRowStart, 19])
                {
                    rSigLine.Merge = true;
                    rSigLine.Value = "";
                    rSigLine.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    rSigLine.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                }

                using (ExcelRange rDateLine = workSheet.Cells[DataRowStart, 21, DataRowStart, 25])
                {
                    rDateLine.Merge = true;
                    rDateLine.Value = "";
                    rDateLine.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                    rDateLine.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                }

                DataRowStart++;
                using (ExcelRange rSigLineText = workSheet.Cells[DataRowStart, col, DataRowStart, 19])
                {
                    rSigLineText.Merge = true;
                    rSigLineText.Value = "Signature";
                }

                using (ExcelRange rDateLineText = workSheet.Cells[DataRowStart, 21, DataRowStart, 25])
                {
                    rDateLineText.Merge = true;
                    rDateLineText.Value = "Date";
                }

                if (!prvm.IsDRBuyType)
                {
                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "UPFRONT CANCELLATION:";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = prvm.DealPointInfo.UpfrontCancellation;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "SCATTER CANCELLATION:";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = prvm.DealPointInfo.ScatterCancellation;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "NETWORK SEPARATION POLICY:";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = prvm.DealPointInfo.NetworkSeparationPolicy;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "All paid spots are non pre-emptible unless approved by Ocean Media prior to pre-emption.";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "No more than 1 spot per program.";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "Not withstanding anything herein or elsewhere contained to the company, " + prvm.NetworkInfo.StdNetName + " acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to " + prvm.NetworkInfo.StdNetName + " unless and until said principal has paid Ocean Media.";
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                }
                else
                {
                    DataRowStart++;
                    DataRowStart++;
                    workSheet.Cells[DataRowStart, col].Value = "SCATTER CANCELLATION: Five Business Days Cancel ";
                    workSheet.Cells[DataRowStart, col].Style.Font.Bold = true;
                    workSheet.Cells[DataRowStart, col].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                DataRowStart++;
                DataRowStart++;
                workSheet.Cells[DataRowStart, col].Value = "Comments:  ";

                DataRowStart++;
                using (ExcelRange rComments = workSheet.Cells[DataRowStart, 1, DataRowStart + 4, colCount])
                {
                    rComments.Merge = true;

                    rComments.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    rComments.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    rComments.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                    rComments.Style.VerticalAlignment = ExcelVerticalAlignment.Top;
                    rComments.Value = prvm.QuaterlyClientNote;
                }

                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                DataRowStart++;
                using (ExcelRange rFooter = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    rFooter.Merge = true;
                    rFooter.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    rFooter.Style.Font.Italic = true;
                    rFooter.Style.Font.Color.SetColor(System.Drawing.Color.Gray);
                    rFooter.Value = "Thank you very much for doing business with us. We look forward to working with you again!";
                }

                DataRowStart++;
                using (ExcelRange rFooter = workSheet.Cells[DataRowStart, 1, DataRowStart, colCount])
                {
                    rFooter.Merge = true;
                    rFooter.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    rFooter.Style.Font.Italic = true;
                    rFooter.Style.Font.Color.SetColor(System.Drawing.Color.Gray);
                    rFooter.Value = "Proposal Generated on:  " + DateTime.Now.ToLongDateString() + " " + DateTime.Now.ToShortTimeString() + " by " + prvm.LoggedOnUser.DisplayName;
                }

                result = package.GetAsByteArray();
                return result;
            }
        }
        public static byte[] ExportExcel(ScheduleViewModel svm)
        {
            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Schedule");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 1;
                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Rev #";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Rev Dt";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "Demo Name";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "Property Name";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "M";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "T";
                workSheet.Cells["H" + DataRowStart.ToString()].Value = "W";
                workSheet.Cells["I" + DataRowStart.ToString()].Value = "Th";
                workSheet.Cells["J" + DataRowStart.ToString()].Value = "F";
                workSheet.Cells["K" + DataRowStart.ToString()].Value = "Sa";
                workSheet.Cells["L" + DataRowStart.ToString()].Value = "Su";
                workSheet.Cells["M" + DataRowStart.ToString()].Value = "DP";
                workSheet.Cells["N" + DataRowStart.ToString()].Value = "Start Time";
                workSheet.Cells["O" + DataRowStart.ToString()].Value = "End Time";
                workSheet.Cells["P" + DataRowStart.ToString()].Value = "OMDP";
                workSheet.Cells["Q" + DataRowStart.ToString()].Value = "SP Buy";
                workSheet.Cells["R" + DataRowStart.ToString()].Value = "SpotLen";
                workSheet.Cells["S" + DataRowStart.ToString()].Value = "BuyType";
                workSheet.Cells["T" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["U" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["V" + DataRowStart.ToString()].Value = "CPM";
                workSheet.Cells["W" + DataRowStart.ToString()].Value = "Imp";
                workSheet.Cells["X" + DataRowStart.ToString()].Value = "Total Spots";
                int colCount = 24;
                if (svm.ProposalQuarter.Wk01_Date != null) { colCount++; workSheet.Cells["Y" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk01_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk02_Date != null) { colCount++; workSheet.Cells["Z" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk02_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk03_Date != null) { colCount++; workSheet.Cells["AA" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk03_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk04_Date != null) { colCount++; workSheet.Cells["AB" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk04_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk05_Date != null) { colCount++; workSheet.Cells["AC" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk05_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk06_Date != null) { colCount++; workSheet.Cells["AD" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk06_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk07_Date != null) { colCount++; workSheet.Cells["AE" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk07_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk08_Date != null) { colCount++; workSheet.Cells["AF" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk08_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk09_Date != null) { colCount++; workSheet.Cells["AG" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk09_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk10_Date != null) { colCount++; workSheet.Cells["AH" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk10_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk11_Date != null) { colCount++; workSheet.Cells["AI" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk11_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk12_Date != null) { colCount++; workSheet.Cells["AJ" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk12_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk13_Date != null) { colCount++; workSheet.Cells["AK" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk13_Date.Value.ToShortDateString(); }
                if (svm.ProposalQuarter.Wk14_Date != null) { colCount++; workSheet.Cells["AL" + DataRowStart.ToString()].Value = svm.ProposalQuarter.Wk14_Date.Value.ToShortDateString(); }

                foreach (ScheduleProposalLinesFlat sLines in svm.ProposalLines)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = sLines.RateRevision;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = sLines.RateUpdateDt.ToShortDateString();
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = sLines.DemoName;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = sLines.NetworkName;
                    workSheet.Cells["E" + DataRowStart.ToString()].Value = sLines.PropertyName;
                    workSheet.Cells["F" + DataRowStart.ToString()].Value = sLines.Monday;

                    workSheet.Cells["G" + DataRowStart.ToString()].Value = sLines.Tuesday;
                    workSheet.Cells["H" + DataRowStart.ToString()].Value = sLines.Wednesday;
                    workSheet.Cells["I" + DataRowStart.ToString()].Value = sLines.Thursday;
                    workSheet.Cells["J" + DataRowStart.ToString()].Value = sLines.Friday;
                    workSheet.Cells["K" + DataRowStart.ToString()].Value = sLines.Saturday;
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = sLines.Sunday;

                    workSheet.Cells["M" + DataRowStart.ToString()].Value = sLines.DayPartCd;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = sLines.StartToEndTime.ToString().Split('-')[0].Trim();
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = sLines.StartToEndTime.ToString().Split('-')[1].Trim();
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = sLines.OMDP;
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = sLines.SPBuy;
                    workSheet.Cells["R" + DataRowStart.ToString()].Value = sLines.SpotLen;

                    workSheet.Cells["S" + DataRowStart.ToString()].Value = sLines.BuyTypeCode;
                    workSheet.Cells["T" + DataRowStart.ToString()].Value = Math.Round(sLines.RateAmt, 2);//sLines.RateAmt;
                    workSheet.Cells["T" + DataRowStart.ToString()].Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["U" + DataRowStart.ToString()].Value = Math.Round(sLines.Discount, 2);//sLines.Discount; ST-346
                    workSheet.Cells["U" + DataRowStart.ToString()].Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["V" + DataRowStart.ToString()].Value = sLines.CPM;
                    workSheet.Cells["W" + DataRowStart.ToString()].Value = sLines.Impressions;
                    workSheet.Cells["W" + DataRowStart.ToString()].Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["X" + DataRowStart.ToString()].Value = sLines.TotalSpots;

                    if (svm.ProposalQuarter.Wk01_Date != null) { workSheet.Cells["Y" + DataRowStart.ToString()].Value = sLines.Wk01_Spots; }
                    if (svm.ProposalQuarter.Wk02_Date != null) { workSheet.Cells["Z" + DataRowStart.ToString()].Value = sLines.Wk02_Spots; }
                    if (svm.ProposalQuarter.Wk03_Date != null) { workSheet.Cells["AA" + DataRowStart.ToString()].Value = sLines.Wk03_Spots; }
                    if (svm.ProposalQuarter.Wk04_Date != null) { workSheet.Cells["AB" + DataRowStart.ToString()].Value = sLines.Wk04_Spots; }
                    if (svm.ProposalQuarter.Wk05_Date != null) { workSheet.Cells["AC" + DataRowStart.ToString()].Value = sLines.Wk05_Spots; }
                    if (svm.ProposalQuarter.Wk06_Date != null) { workSheet.Cells["AD" + DataRowStart.ToString()].Value = sLines.Wk06_Spots; }
                    if (svm.ProposalQuarter.Wk07_Date != null) { workSheet.Cells["AE" + DataRowStart.ToString()].Value = sLines.Wk07_Spots; }
                    if (svm.ProposalQuarter.Wk08_Date != null) { workSheet.Cells["AF" + DataRowStart.ToString()].Value = sLines.Wk08_Spots; }
                    if (svm.ProposalQuarter.Wk09_Date != null) { workSheet.Cells["AG" + DataRowStart.ToString()].Value = sLines.Wk09_Spots; }
                    if (svm.ProposalQuarter.Wk10_Date != null) { workSheet.Cells["AH" + DataRowStart.ToString()].Value = sLines.Wk10_Spots; }
                    if (svm.ProposalQuarter.Wk11_Date != null) { workSheet.Cells["AI" + DataRowStart.ToString()].Value = sLines.Wk11_Spots; }
                    if (svm.ProposalQuarter.Wk12_Date != null) { workSheet.Cells["AJ" + DataRowStart.ToString()].Value = sLines.Wk12_Spots; }
                    if (svm.ProposalQuarter.Wk13_Date != null) { workSheet.Cells["AK" + DataRowStart.ToString()].Value = sLines.Wk13_Spots; }
                    if (svm.ProposalQuarter.Wk14_Date != null) { workSheet.Cells["AL" + DataRowStart.ToString()].Value = sLines.Wk14_Spots; }
                    // Changing color for DOW if it is changed
                    if (sLines.IsDowChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 6, DataRowStart, 12])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    // Changing color for Start and End time if it is changed
                    if (sLines.IsTimeChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 14, DataRowStart, 15])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                }

                for (int i = 1; i <= colCount; i++)
                {
                    workSheet.Column(i).AutoFit();
                }

                result = package.GetAsByteArray();
            }
            return result;
        }
        // Export Raw Proposal Files to Excel(Proposal automation)
        public static byte[] ExportExcelRawProposals(IEnumerable<ProposalsRawFileExportModel> lstProposals)
        {

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan to Export Data in excel
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("Proposal Summary Import OptionDealSummary");
                workSheet.View.ShowGridLines = true;
                string Week14Val = lstProposals.First().Col30;
                int DataRowStart = 0;
                foreach (ProposalsRawFileExportModel PLines in lstProposals)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = PLines.Col1;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = PLines.Col2;
                    workSheet.Cells["C" + DataRowStart.ToString()].Value = PLines.Col3;
                    workSheet.Cells["D" + DataRowStart.ToString()].Value = PLines.Col4;
                    workSheet.Cells["E" + DataRowStart.ToString()].Value = PLines.Col5;
                    workSheet.Cells["F" + DataRowStart.ToString()].Value = PLines.Col6;

                    workSheet.Cells["G" + DataRowStart.ToString()].Value = PLines.Col7;
                    workSheet.Cells["H" + DataRowStart.ToString()].Value = PLines.Col8;
                    workSheet.Cells["I" + DataRowStart.ToString()].Value = PLines.Col9;
                    workSheet.Cells["J" + DataRowStart.ToString()].Value = PLines.Col10;
                    if (DataRowStart > 8)
                    {
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = Math.Round(Convert.ToDecimal(PLines.Col11), 0);
                        workSheet.Cells["K" + DataRowStart.ToString()].Style.Numberformat.Format = "#,##";
                    }
                    else
                    {
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = PLines.Col11;
                    }

                    workSheet.Cells["L" + DataRowStart.ToString()].Value = PLines.Col12;

                    workSheet.Cells["M" + DataRowStart.ToString()].Value = PLines.Col13;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = PLines.Col14;

                    workSheet.Cells["O" + DataRowStart.ToString()].Value = PLines.Col15;
                    if (DataRowStart > 8)
                    {
                        workSheet.Cells["P" + DataRowStart.ToString()].Value = PLines.Col16 == "0" ? "" : Convert.ToInt32(PLines.Col16);
                        workSheet.Cells["Q" + DataRowStart.ToString()].Value = PLines.Col17 == "0" ? "" : Convert.ToInt32(PLines.Col17);
                        workSheet.Cells["R" + DataRowStart.ToString()].Value = PLines.Col18 == "0" ? "" : Convert.ToInt32(PLines.Col18);
                        workSheet.Cells["S" + DataRowStart.ToString()].Value = PLines.Col19 == "0" ? "" : Convert.ToInt32(PLines.Col19);
                        workSheet.Cells["T" + DataRowStart.ToString()].Value = PLines.Col20 == "0" ? "" : Convert.ToInt32(PLines.Col20);
                        workSheet.Cells["U" + DataRowStart.ToString()].Value = PLines.Col21 == "0" ? "" : Convert.ToInt32(PLines.Col21);
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = PLines.Col22 == "0" ? "" : Convert.ToInt32(PLines.Col22);
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = PLines.Col23 == "0" ? "" : Convert.ToInt32(PLines.Col23);
                        workSheet.Cells["X" + DataRowStart.ToString()].Value = PLines.Col24 == "0" ? "" : Convert.ToInt32(PLines.Col24);
                        workSheet.Cells["Y" + DataRowStart.ToString()].Value = PLines.Col25 == "0" ? "" : Convert.ToInt32(PLines.Col25);
                        workSheet.Cells["Z" + DataRowStart.ToString()].Value = PLines.Col26 == "0" ? "" : Convert.ToInt32(PLines.Col26);
                        workSheet.Cells["AA" + DataRowStart.ToString()].Value = PLines.Col27 == "0" ? "" : Convert.ToInt32(PLines.Col27);
                        workSheet.Cells["AB" + DataRowStart.ToString()].Value = PLines.Col28 == "0" ? "" : Convert.ToInt32(PLines.Col28);
                        workSheet.Cells["AC" + DataRowStart.ToString()].Value = PLines.Col29 == "0" ? "" : Convert.ToInt32(PLines.Col29);
                        if (!string.IsNullOrEmpty(Week14Val))
                            workSheet.Cells["AD" + DataRowStart.ToString()].Value = PLines.Col30 == "0" ? "" : Convert.ToInt32(PLines.Col30);
                    }
                    else
                    {
                        workSheet.Cells["P" + DataRowStart.ToString()].Value = PLines.Col16;
                        workSheet.Cells["Q" + DataRowStart.ToString()].Value = PLines.Col17;
                        workSheet.Cells["R" + DataRowStart.ToString()].Value = PLines.Col18;
                        workSheet.Cells["S" + DataRowStart.ToString()].Value = PLines.Col19;
                        workSheet.Cells["T" + DataRowStart.ToString()].Value = PLines.Col20;
                        workSheet.Cells["U" + DataRowStart.ToString()].Value = PLines.Col21;
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = PLines.Col22;
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = PLines.Col23;
                        workSheet.Cells["X" + DataRowStart.ToString()].Value = PLines.Col24;
                        workSheet.Cells["Y" + DataRowStart.ToString()].Value = PLines.Col25;
                        workSheet.Cells["Z" + DataRowStart.ToString()].Value = PLines.Col26;
                        workSheet.Cells["AA" + DataRowStart.ToString()].Value = PLines.Col27;
                        workSheet.Cells["AB" + DataRowStart.ToString()].Value = PLines.Col28;
                        workSheet.Cells["AC" + DataRowStart.ToString()].Value = PLines.Col29;
                        if (!string.IsNullOrEmpty(Week14Val))
                            workSheet.Cells["AD" + DataRowStart.ToString()].Value = PLines.Col30;
                    }
                }

                for (int i = 1; i <= 30; i++)
                {
                    workSheet.Column(i).AutoFit();
                }
                using (ExcelRange r = workSheet.Cells[1, 15, 1, !string.IsNullOrEmpty(Week14Val) ? 30 : 29])
                {
                    r.Style.Font.Color.SetColor(System.Drawing.Color.White);
                    r.Style.Font.Bold = true;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#9ccc65"));
                    r.Style.Font.Bold = true;
                }
                using (ExcelRange r2 = workSheet.Cells[8, 1, 8, !string.IsNullOrEmpty(Week14Val) ? 30 : 29])
                {
                    r2.Style.Font.Color.SetColor(System.Drawing.Color.White);
                    r2.Style.Font.Bold = true;
                    r2.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r2.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#9ccc65"));
                    r2.Style.Font.Bold = true;
                }
                result = package.GetAsByteArray();
            }
            return result;
        }

    }
}