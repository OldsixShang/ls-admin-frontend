(function ($) {
    $.easyui = $.extend($.easyui, function () {
        //延迟设置值
        function setLazyValue(id, fnSetValue) {
            return function () {
                var $this = $("#" + id);
                var value = $this.attr("lazyValue");
                if (!value)
                    return;
                fnSetValue($this, value);
                $this.attr("lazyValue", "");
            };
        }

        //获取详细div
        function getDetailHtml() {
            return '<div class="gridDetail"></div>';
        }

        return {
            //初始化编辑窗口
            initEditDialog: function (options) {
                return $.easyui.initDialog(options, $.easyui.editNotSelectedMessage);
            },
            //初始化详细窗口
            initDetailDialog: function (options) {
                return $.easyui.initDialog(options, $.easyui.lookNotSelectedMessage);
            },
            //显示更新窗口
            showEditDialog_onDblClickRow: function (btnId) {
                return function () {
                    $.easyui.getEditButton(btnId).click();
                };
            },
            //显示更新窗口
            showEditDialog: function () {
                $.easyui.getEditButton().click();
            },
            //显示查看窗口
            showDetailDialog: function () {
                $("#" + $.easyui.btnLookId).click();
            },
            //右键单击表格,显示上下文菜单
            showGridMenu_onRowContextMenu: function (gridId, menuId) {
                return function (e, index) {
                    $.easyui.getGrid(gridId).datagrid("selectRow", index);
                    $.easyui.showMenu($.easyui.getGridMenu(menuId), e);
                };
            },
            //右键单击树型表格,显示上下文菜单
            showTreeGridMenu_onContextMenu: function (gridId, menuId) {
                return function (e, row) {
                    $.easyui.getGrid(gridId).treegrid("select", row.Id);
                    $.easyui.showMenu($.easyui.getGridMenu(menuId), e);
                };
            },
            //单击表格菜单项-表单操作
            fnClickGridMenuItem_Form: function (item) {
                switch (item.id) {
                    case "menuItem_Edit":
                        return $.easyui.showEditDialog();
                    case "menuItem_Delete":
                        return $.easyui.delete();
                    case "menuItem_Look":
                        return $.easyui.showDetailDialog();
                    case "menuItem_Refresh":
                        return $.easyui.refresh();
                }
                return true;
            },
            //单击表格菜单项-表格编辑操作
            fnClickGridMenuItem_Grid: function (item) {
                switch (item.id) {
                    case "menuItem_Edit":
                        return $.easyui.grid.edit();
                    case "menuItem_Delete":
                        return $.easyui.grid.delete();
                    case "menuItem_Refresh":
                        return $.easyui.refresh();
                }
                return true;
            },
            //单击树型表格菜单项
            fnClickTreeGridMenuItem: function (item) {
                switch (item.id) {
                    case "menuItem_AddToChild":
                        return $.easyui.treegrid.addToChild();
                    case "menuItem_Edit":
                        return $.easyui.treegrid.edit();
                    case "menuItem_Delete":
                        return $.easyui.treegrid.delete();
                    case "menuItem_MoveUp":
                        return $.easyui.treegrid.moveUp();
                    case "menuItem_MoveDown":
                        return $.easyui.treegrid.moveDown();
                    case "menuItem_AddToBefore":
                        return $.easyui.treegrid.addToBefore();
                    case "menuItem_AddToAfter":
                        return $.easyui.treegrid.addToAfter();
                    case "menuItem_FixSortId":
                        return $.easyui.treegrid.fixSortId();
                    case "menuItem_Refresh":
                        return $.easyui.treegrid.refresh();
                }
                return true;
            },
            //仅允许选择树叶节点
            fnSelectTreeLeafOnly: function (node) {
                if (node.children && node.children.length > 0)
                    return false;
                return true;
            },
            //文本更改事件-支持设置多个事件处理函数
            textbox_onChange: function (callbacks) {
                return function (newValue, oldValue) {
                    if (!callbacks)
                        return;
                    var control = $(this);
                    $.each(callbacks, function (i, fn) {
                        fn(newValue, oldValue, control);
                    });
                };
            },
            //设置联动子combox控件 - onChange事件
            setChildCombox_onChange: function (childId, requestParam, url) {
                return function (newValue, oldValue, control) {
                    var child = $("#" + childId);
                    child.combobox("setValue", "");
                    if (!newValue) {
                        child.combobox("loadData", []);
                        return;
                    }
                    child.combobox("reload", getUrl());

                    //获取子控件url
                    function getUrl() {
                        url = url || getComboxUrl();
                        return addUrlParam();

                        //获取组合框url
                        function getComboxUrl() {
                            var options = $.data(control.get(0), "combobox").options;
                            return options.url;
                        }

                        //添加url参数
                        function addUrlParam() {
                            return $.removeUrlParams(url) + "?" + requestParam + "=" + newValue;
                        }
                    }
                };
            },
            //设置combox对应的隐藏控件文本 - onChange事件
            setComboxHiddenText_onChange: function (hiddenName) {
                return function (newValue, oldValue, control) {
                    var data = control.combobox("getData");
                    $.each(data, function (i, item) {
                        if (item.value === newValue)
                            $(":hidden[name='" + hiddenName + "']").val(item.text);
                    });
                };
            },
            //延迟设置Combox控件值 - onLoadSuccess事件
            setComboxLazyValue_onLoadSuccess: function (id) {
                return setLazyValue(id, function (control, value) {
                    control.combobox("setValue", value);
                });
            },
            //延迟设置ComboTree控件值 - onLoadSuccess事件
            setComboTreeLazyValue_onLoadSuccess: function (id) {
                return setLazyValue(id, function (control, value) {
                    control.combotree("setValue", value);
                });
            },
            //加载子表格 - onLoadSuccess事件
            loadSubGrid_onLoadSuccess: function (options) {
                return function (data) {
                    $("#grid").datagrid("subgrid", options);
                };
            },
            //表格详细 - Html内容
            gridDetail_detailFormatter: function () {
                return function (index, row) {
                    return getDetailHtml();
                };
            },
            //表格详细 - onExpandRow事件
            gridDetail_onExpandRow: function (url, isShowBorder, fnCreateUrl, paramName, buttonsDivId) {
                return function (index, row) {
                    var grid = $(this);
                    initRows();
                    var divDetail = getDetailDiv(index);
                    if (isLoad(divDetail))
                        return;
                    load();

                    //初始化
                    function initRows() {
                        var rows = grid.datagrid("getRows");
                        $.each(rows, function (i, each) {
                            var rowIndex = grid.datagrid("getRowIndex", each);
                            if (index === rowIndex)
                                return;
                            var detail = getDetailDiv(rowIndex);
                            if (!isLoad(detail))
                                return;
                            grid.datagrid('collapseRow', rowIndex);
                            grid.datagrid('getRowDetail', rowIndex).html(getDetailHtml());
                        });
                    }

                    //获取div
                    function getDetailDiv(rowIndex) {
                        return grid.datagrid('getRowDetail', rowIndex).find('div.gridDetail');
                    }

                    //判断是否已加载
                    function isLoad(detail) {
                        if (!detail || detail.length === 0)
                            return false;
                        return detail[0].outerHTML !== getDetailHtml();
                    }

                    //加载内容
                    function load() {
                        divDetail.panel({
                            border: isShowBorder || false,
                            href: getUrl(),
                            width: '100%',
                            onLoad: function () {
                                $.easyui.initControls();
                                fixButtons($(this));
                                grid.datagrid('fixDetailRowHeight', index);
                                grid.datagrid('selectRow', index);
                                setTimeout(function () {
                                    grid.datagrid('fixDetailRowHeight', index);
                                }, 1000);

                                //修正面板按钮位置
                                function fixButtons($panel) {
                                    var panel = $panel.panel("panel");
                                    buttonsDivId = buttonsDivId || $.easyui.buttonsDivId;
                                    var btn = grid.datagrid('getRowDetail', index).find('#' + buttonsDivId);
                                    if (!btn || btn.length === 0)
                                        return;
                                    btn.addClass("dialog-button").appendTo(panel);
                                }
                            },
                            onResize: function (width, height) {
                                grid.datagrid('fixDetailRowHeight', index);
                            }
                        });

                        //获取Url
                        function getUrl() {
                            if (fnCreateUrl)
                                return fnCreateUrl(row);
                            paramName = paramName || "id";
                            return url + "?" + paramName + "=" + row.Id;
                        }
                    }
                };
            },
        };
    }());
})(jQuery);

