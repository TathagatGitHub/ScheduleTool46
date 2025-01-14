// Modified/Restructured by Hunain Manzoor For ST-446/447 on 10/06/2023

var isEditMode = window.location.pathname.indexOf("Edit") !== -1 ? true : false;
var isViewMode = window.location.pathname.indexOf("View") !== -1 ? true : false;
var preOrPostLog = window.location.pathname.indexOf("PreLog") !== -1 ? "PreLogViewTable" : "PostLogViewTable";
var selectedIndexes = [];
var selectAll = false;
(function ($$1) {
    'use strict';

    $$1 = 'default' in $$1 ? $$1['default'] : $$1;
    var FilterMenu = function () {
        function FilterMenu(target, th, column, index, options) {
            var col = isEditMode ? 1 : 0;
            this.options = options;
            this.th = th;
            this.column = column;
            this.index = index;
            this.tds = this.column == col ? target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray() : selectAll == true ? target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray() : $($("#" + preOrPostLog + " tbody tr").not("[style *= 'display: none']")).children('td:nth-child(' + (this.column + 1) + ')').toArray();
        }
        FilterMenu.prototype.initialize = function () {
            this.menu = this.dropdownFilterDropdown();
            this.th.appendChild(this.menu);
            var $trigger = $(this.menu.children[0]);
            var $content = $(this.menu.children[1]);
            var $menu = $(this.menu);
            $trigger.click(function () {
                return $content.toggle();
            });
            $(document).click(function (el) {
                if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
                    $content.hide();
                }
            });
        };
        FilterMenu.prototype.searchToggle = function (value) {
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
            if (value.length === 0) {
                this.toggleAll(true);
                if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
                return;
            }
            this.toggleAll(false);
            this.inputs.filter(function (input) {
                return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).forEach(function (input) {
                input.checked = true;
            });
        };
        FilterMenu.prototype.updateSelectAll = function () {
            if (this.selectAllCheckbox instanceof HTMLInputElement) {
                $(this.searchFilter).val('');
                this.selectAllCheckbox.checked = this.inputs.length === this.inputs.filter(function (input) {
                    return input.checked;
                }).length;
                if (this.inputs.length === this.inputs.filter(function (input) {
                    return input.checked;
                }).length) {
                    selectedIndexes.splice(selectedIndexes.indexOf(Number(this.selectAllCheckbox.dataset.index)), 1);
                }
            }
        };
        FilterMenu.prototype.selectAllUpdate = function (checked) {
            $(this.searchFilter).val('');
            this.toggleAll(checked);
        };
        FilterMenu.prototype.toggleAll = function (checked) {
            for (var i = 0; i < this.inputs.length; i++) {
                var input = this.inputs[i];
                if (input instanceof HTMLInputElement) input.checked = checked;
            }
        };
        FilterMenu.prototype.dropdownFilterItem = function (td, self) {
            var value = td.innerText;
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-item';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.value = value.trim().replace(/ +(?= )/g, '');
            input.setAttribute('checked', 'checked');
            input.className = 'dropdown-filter-menu-item item';
            input.setAttribute('data-column', self.column.toString());
            input.setAttribute('data-index', self.index.toString());
            dropdownFilterItem.appendChild(input);
            dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML.trim() + ' ' + value;
            return dropdownFilterItem;
        };
        FilterMenu.prototype.dropdownFilterItemSelectAll = function () {
            var value = this.options.captions.select_all;
            var dropdownFilterItemSelectAll = document.createElement('div');
            dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.value = this.options.captions.select_all;
            input.setAttribute('checked', 'checked');
            input.className = 'dropdown-filter-menu-item select-all';
            input.setAttribute('data-column', this.column.toString());
            input.setAttribute('data-index', this.index.toString());
            dropdownFilterItemSelectAll.appendChild(input);
            dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' + value;
            return dropdownFilterItemSelectAll;
        };
        FilterMenu.prototype.dropdownFilterSearch = function () {
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-search';
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'dropdown-filter-menu-search form-control';
            input.setAttribute('style', 'padding:1px;');
            input.setAttribute('data-column', this.column.toString());
            input.setAttribute('data-index', this.index.toString());
            input.setAttribute('placeholder', this.options.captions.search);
            dropdownFilterItem.appendChild(input);
            return dropdownFilterItem;
        };
        FilterMenu.prototype.dropdownFilterSort = function (direction) {
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-sort';
            var span = document.createElement('span');
            span.className = direction.toLowerCase().split(' ').join('-');
            span.setAttribute('data-column', this.column.toString());
            span.setAttribute('data-index', this.index.toString());
            span.innerText = direction;
            dropdownFilterItem.appendChild(span);
            return dropdownFilterItem;
        };
        FilterMenu.prototype.dropdownFilterContent = function () {
            var _this = this;
            var self = this;
            var dropdownFilterContent = document.createElement('div');
            dropdownFilterContent.className = 'dropdown-filter-content text-left';
            var innerDivs = this.tds.reduce(function (arr, el) {
                var values = arr.map(function (el) {
                    return el.innerText.trim();
                });
                if (values.indexOf(el.innerText.trim()) < 0) arr.push(el);
                return arr;
            }, []).sort(function (a, b) {
                var A = a.innerText.toLowerCase();
                var B = b.innerText.toLowerCase();
                var dateval = '2021-01-01';// Get Simple Date for example

                if (A == "" && B == "") return -1;
                if (A == "" && B != "") return -1;

                if (A != "" && B == "") return 1;

                if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                    if (Number(A) < Number(B)) return -1;
                    if (Number(A) > Number(B)) return 1;
                }
                else if (!isNaN(Date.parse(new Date(dateval + ' ' + A))) && !isNaN(Date.parse(new Date(dateval + ' ' + B)))) {
                    if (Date.parse(new Date(dateval + ' ' + A)) < Date.parse(new Date(dateval + ' ' + B))) return -1;
                    if (Date.parse(new Date(dateval + ' ' + A)) > Date.parse(new Date(dateval + ' ' + B))) return 1;
                }
                else {
                    if (
                        (A.indexOf("$") > -1 && B.indexOf("$" > -1))
                        ||
                        A.endsWith(".00") > -1 && A.endsWith(".00")
                    ) {
                        if (parseFloat(A.replace(/[^0-9\.]+/g, "")) < parseFloat(B.replace(/[^0-9\.]+/g, ""))) return -1;
                        if (parseFloat(A.replace(/[^0-9\.]+/g, "")) > parseFloat(B.replace(/[^0-9\.]+/g, ""))) return 1;
                    }
                    else {
                        if (A < B) return -1;
                        if (A > B) return 1;
                    }
                }
                return 0;
            }).map(function (td) {
                return _this.dropdownFilterItem(td, self);
            });
            this.inputs = innerDivs.map(function (div) {
                return div.firstElementChild;
            });
            var selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
            this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
            innerDivs.unshift(selectAllCheckboxDiv);
            var searchFilterDiv = this.dropdownFilterSearch();
            this.searchFilter = searchFilterDiv.firstElementChild;
            var outerDiv = innerDivs.reduce(function (outerDiv, innerDiv) {
                outerDiv.appendChild(innerDiv);
                return outerDiv;
            }, document.createElement('div'));
            outerDiv.className = 'checkbox-container';
            var elements = [];
            if (this.options.sort) elements = elements.concat([this.dropdownFilterSort(this.options.captions.a_to_z), this.dropdownFilterSort(this.options.captions.z_to_a)]);
            if (this.options.search) elements.push(searchFilterDiv);
            return elements.concat(outerDiv).reduce(function (html, el) {
                html.appendChild(el);
                return html;
            }, dropdownFilterContent);
        };
        FilterMenu.prototype.dropdownFilterDropdown = function () {
            var dropdownFilterDropdown = document.createElement('div');
            dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
            var arrow = document.createElement('span');
            arrow.className = 'dropdown-filter-icon';
            var icon = document.createElement('i');
            icon.className = 'arrow-down';
            arrow.appendChild(icon);
            dropdownFilterDropdown.appendChild(arrow);
            dropdownFilterDropdown.appendChild(this.dropdownFilterContent());
            if ($(this.th).hasClass('no-sort')) {
                $(dropdownFilterDropdown).find('.dropdown-filter-sort').remove();
            }
            if ($(this.th).hasClass('no-filter')) {
                $(dropdownFilterDropdown).find('.checkbox-container').remove();
            }
            if ($(this.th).hasClass('no-search')) {
                $(dropdownFilterDropdown).find('.dropdown-filter-search').remove();
            }
            return dropdownFilterDropdown;
        };
        return FilterMenu;
    }();

    var FilterCollection = function () {
        function FilterCollection(target, options) {
            this.target = target;
            this.options = options;
            this.ths = target.find('th' + options.columnSelector).toArray();
            this.filterMenus = this.ths.map(function (th, index) {
                var column = $(th).index();
                return new FilterMenu(target, th, column, index, options);
            });
            this.rows = target.find('tbody').find('tr').toArray();
            this.table = target.get(0);
        }
        FilterCollection.prototype.initialize = function () {
            this.filterMenus.forEach(function (filterMenu) {
                filterMenu.initialize();
            });
            this.bindCheckboxes();
            this.bindSelectAllCheckboxes();
            this.bindSort();
            this.bindSearch();
        };
        FilterCollection.prototype.bindCheckboxes = function () {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-menu-item.item').change(function () {
                var index = $(this).data('index');
                var value = $(this).val();                
                if (selectedIndexes.indexOf(index) == -1) {
                    selectedIndexes.push(index);
                }
                filterMenus[index].updateSelectAll();
                updateRowVisibility(filterMenus, rows, ths, filterMenus[index].column);
                CalculateTotals();               
            });
        };
        FilterCollection.prototype.bindSelectAllCheckboxes = function () {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-menu-item.select-all').change(function () {
                var index = $(this).data('index');
                var value = this.checked;
                filterMenus[index].selectAllUpdate(value);
                if (selectedIndexes.indexOf(index) == -1 && value == false) {
                    selectedIndexes.push(index);
                }
                if (selectedIndexes.indexOf(index) !== -1 && value == true) {
                    selectedIndexes.splice(selectedIndexes.indexOf(index), 1); // added to fix where seleting network causing not to load rows due to index was not reseting when user do selectAll    HM-ST-446/447
                }                
                updateRowVisibility(filterMenus, rows, ths, filterMenus[index].column);
                CalculateTotals();               
            });
        };
        FilterCollection.prototype.bindSort = function () {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var ths = this.ths;
            var sort = this.sort;
            var table = this.table;
            var options = this.options;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-sort').click(function () {
                var $sortElement = $(this).find('span');
                var column = $sortElement.data('column');
                var order = $sortElement.attr('class');
                sort(column, order, table, options);
                updateRowVisibility(filterMenus, rows, ths, column.index);
            });
        };
        FilterCollection.prototype.bindSearch = function () {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-search').keyup(function () {
                var $input = $(this).find('input');
                var index = $input.data('index');
                var value = $input.val();
                filterMenus[index].searchToggle(value);
                updateRowVisibility(filterMenus, rows, ths, filterMenus[index].column);
                CalculateTotals();
            });
        };
     
        FilterCollection.prototype.updateRowVisibility = function (filterMenus, rows, ths, colIndex) {
            var showRows = rows;
            var hideRows = [];
            var filteredlist = (colIndex == undefined) ? filterMenus : selectedIndexes.length == 0 ? filterMenus.filter(o => o.index == colIndex) : filterMenus.filter(o => selectedIndexes.indexOf(o.index) !== -1); // ST-446/447 Added by HM on 10/03/2023 to speed up the data reloading.
            var selectedLists = filteredlist.map(function (filterMenu) {
                return {
                    column: filterMenu.column,
                    selected: filterMenu.inputs.filter(function (input) {
                        return input.checked;
                    }).map(function (input) {
                        return input.value.trim().replace(/ +(?= )/g, '');
                    })
                };
            });
            var filteredRowCount = 0;
           
            $(rows).filter(function () {  
                var showRow = false;
                var tds = this.children;                
                    
                for (var j = 0; j < selectedLists.length; j++) {
                    var content = $(tds[selectedLists[j].column]).text().trim().replace(/ +(?= )/g, '');
                    if (selectedLists[j].selected.indexOf(content) == -1) {
                        showRow = false;
                        break;
                    }
                    filteredRowCount++;
                    
                    showRow = true;
                    }

                $(this).toggle(showRow);
                //return selectedLists[0].selected.indexOf(rowText) !== -1;
            });
            filteredRowCount = filteredRowCount > rows.length ? rows.length : filteredRowCount;
            var searchText = $($("input.dropdown-filter-menu-search.form-control")[colIndex]).val();
            if (isEditMode) {
                if (rows.length == filteredRowCount && colIndex == 1 && searchText == "") {                  
                    selectAll = true;
                    setTimeout(function () {
                        $(".dropdown-filter-dropdown").remove();
                        $('#' + preOrPostLog).excelTableFilter();
                        $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
                    }, 100);                    
                }

                if (rows.length != filteredRowCount && colIndex == 1 && searchText == "") {
                    selectAll = false;
                    $(".dropdown-filter-dropdown").remove();
                    $('#' + preOrPostLog).excelTableFilter();
                    $($($("#" + preOrPostLog + " th .checkbox-container")[1])[0]).find('input').each(function () {
                        var text = this.defaultValue;
                        if (selectedLists[0].selected.indexOf(text) == -1) {
                            var input = this;
                            if (input instanceof HTMLInputElement) input.checked = false;
                        }
                        else {
                            var input = this;
                            if (input instanceof HTMLInputElement) input.checked = true;
                        }
                    });
                    $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
                }               
            }

            if (isViewMode) {
                if (rows.length == filteredRowCount && colIndex == 0 && searchText == "") {
                    selectAll = true;
                    setTimeout(function () {
                        $(".dropdown-filter-dropdown").remove();
                        $('#' + preOrPostLog).excelTableFilter();
                        $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
                    }, 100);                    
                }
                if (rows.length != filteredRowCount && colIndex == 0 && searchText == "") {
                    selectAll = false;
                    $(".dropdown-filter-dropdown").remove();
                    $('#' + preOrPostLog).excelTableFilter();
                    $($($("#" + preOrPostLog + " th .checkbox-container")[0])[0]).find('input').each(function () {
                        var text = this.defaultValue;
                        if (selectedLists[0].selected.indexOf(text) == -1) {
                            var input = this;
                            if (input instanceof HTMLInputElement) input.checked = false;
                        }
                        else {
                            var input = this;
                            if (input instanceof HTMLInputElement) input.checked = true;
                        }
                    });
                    $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
                }                
            }
            //if (isEditMode) {
            //    if (rows.length == filteredRowCount && colIndex == 1 && searchText == "") {
            //        if (previousSelectionLength < selectedLists[0].selected.length && previousSelectionLength > 0) {
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[2])[0]).html(col2);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[10])[0]).html(col10);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[11])[0]).html(col11);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[12])[0]).html(col12);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[13])[0]).html(col13);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[14])[0]).html(col14);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[15])[0]).html(col15);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[16])[0]).html(col16);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[17])[0]).html(col17);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[18])[0]).html(col18);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[19])[0]).html(col19);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[20])[0]).html(col20);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[21])[0]).html(col21);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[22])[0]).html(col22);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[23])[0]).html(col23);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[24])[0]).html(col24);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[25])[0]).html(col25);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[26])[0]).html(col26);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[27])[0]).html(col27);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[28])[0]).html(col28);
            //            setTimeout(function () {
            //                $(".dropdown-filter-dropdown").remove();
            //                $('#' + preOrPostLog).excelTableFilter();
            //                $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
            //            }, 100);
            //        }
            //    }

            //    if (filteredRowCount != 0 && rows.length != filteredRowCount && colIndex == 1 && searchText == "") {
            //        $(".dropdown-filter-dropdown").remove();
            //        $('#' + preOrPostLog).excelTableFilter();
            //        $($($("#" + preOrPostLog + " th .checkbox-container")[1])[0]).find('input').each(function () {
            //            var text = this.defaultValue;
            //            if (selectedLists[0].selected.indexOf(text) == -1) {
            //                var input = this;
            //                if (input instanceof HTMLInputElement) input.checked = false;
            //            }
            //            else {
            //                var input = this;
            //                if (input instanceof HTMLInputElement) input.checked = true;
            //            }
            //        });
            //        $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
            //    }
            //    previousSelectionLength = selectedLists[0].selected.length;
            //}
            //if (isViewMode) {
            //    if (rows.length == filteredRowCount && colIndex == 0 && searchText == "") {
            //        if (previousSelectionLength < selectedLists[0].selected.length && previousSelectionLength > 0) {
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[1])[0]).html(col2);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[10])[0]).html(col10);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[11])[0]).html(col11);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[12])[0]).html(col12);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[13])[0]).html(col13);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[14])[0]).html(col14);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[15])[0]).html(col15);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[16])[0]).html(col16);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[17])[0]).html(col17);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[18])[0]).html(col18);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[19])[0]).html(col19);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[20])[0]).html(col20);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[21])[0]).html(col21);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[22])[0]).html(col22);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[23])[0]).html(col23);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[24])[0]).html(col24);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[25])[0]).html(col25);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[26])[0]).html(col26);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[27])[0]).html(col27);
            //            $($($("#" + preOrPostLog + " th .checkbox-container")[28])[0]).html(col28);
            //            setTimeout(function () {
            //                $(".dropdown-filter-dropdown").remove();
            //                $('#' + preOrPostLog).excelTableFilter();
            //                $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
            //            }, 100);
            //        }
            //    }
            //    if (filteredRowCount != 0 && rows.length != filteredRowCount && colIndex == 0 && searchText == "") {
            //        $(".dropdown-filter-dropdown").remove();
            //        $('#' + preOrPostLog).excelTableFilter();
            //        $($($("#" + preOrPostLog + " th .checkbox-container")[0])[0]).find('input').each(function () {
            //            var text = this.defaultValue;
            //            if (selectedLists[0].selected.indexOf(text) == -1) {
            //                var input = this;
            //                if (input instanceof HTMLInputElement) input.checked = false;
            //            }
            //            else {
            //                var input = this;
            //                if (input instanceof HTMLInputElement) input.checked = true;
            //            }
            //        });
            //        $($("div.dropdown-filter-content.text-left")[colIndex]).toggle();
            //    }
            //    previousSelectionLength = selectedLists[0].selected.length;
            //}
        };
        FilterCollection.prototype.sort = function (column, order, table, options) {
            var flip = 1;
            if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
            var tbody = $(table).find('tbody').get(0);
            var rows = $(tbody).find('tr').get();
            rows.sort(function (a, b) {
                var A = a.children[column].innerText.toUpperCase();
                var B = b.children[column].innerText.toUpperCase();
                if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                    if (Number(A) < Number(B)) return -1 * flip;
                    if (Number(A) > Number(B)) return 1 * flip;
                } else {
                    if (A < B) return -1 * flip;
                    if (A > B) return 1 * flip;
                }
                return 0;
            });
            for (var i = 0; i < rows.length; i++) {
                tbody.appendChild(rows[i]);
            }
        };
        return FilterCollection;
    }();

    $$1.fn.excelTableFilter = function (options) {
        var target = this;
        options = $$1.extend({}, $$1.fn.excelTableFilter.options, options);
        if (typeof options.columnSelector === 'undefined') options.columnSelector = '';
        if (typeof options.sort === 'undefined') options.sort = true;
        if (typeof options.search === 'undefined') options.search = true;
        if (typeof options.captions === 'undefined') options.captions = {
            a_to_z: 'A to Z',
            z_to_a: 'Z to A',
            search: 'Search',
            select_all: 'Select All'
        };
        var filterCollection = new FilterCollection(target, options);
        filterCollection.initialize();
        return target;
    };
    $$1.fn.excelTableFilter.options = {};

}(jQuery));
//# sourceMappingURL=excel-bootstrap-table-filter-bundle.js.map
