import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Input,
  Popconfirm,
  Popover,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import styles from "./coffeeControls.module.css";
import { useCoffeeMonth } from "../../hooks/useCoffeeMonths";
import { useCoffeeRows } from "../../hooks/useCoffeeRows";
import { useState } from "react";
import TotalRow from "./TotalRow";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const CoffeeControls = () => {
  const {
    createMonth,
    monthOptions,
    selectedMonthId,
    setMonthSearch,
    monthSearch,
    filteredMonths,
    deleteMonth,
    months,
    totalsMonth,
    updateMonth,
    monthName,
    setMonthName,
    newMonthName,
    setNewMonthName,
    handleMonthChange,
  } = useCoffeeMonth();

  const {
    addRow,
    newRow,
    handleDateChange,
    removeDate,
    setNewRow,
    getWeeksForDelete,
    deleteRow,
  } = useCoffeeRows();

  const [pickerValue, setPickerValue] = useState(dayjs());
  const [pickerKey, setPickerKey] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <Flex align="center" gap={8} wrap className={styles.coffee__controls}>
      <Typography.Text strong className={styles.coffee__name}>
        Месяц:
      </Typography.Text>

      <Select
        className={styles.coffee__select}
        size="small"
        value={selectedMonthId}
        options={monthOptions}
        onChange={handleMonthChange}
        showSearch={{
          filterOption: (input, option) =>
            option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false,
        }}
      />

      <Flex gap={8} className={styles.coffee__actions}>
        {/* недели */}
        <Popover
          trigger="click"
          styles={{ root: { position: "fixed" } }}
          content={
            <Flex vertical align="flex-start" gap={5}>
              <Typography.Text strong>Добавить неделю</Typography.Text>

              <Flex justify="space-between" style={{ width: "100%" }} gap={10}>
                <DatePicker
                  key={pickerKey}
                  style={{ flex: 1 }}
                  format="D"
                  size="small"
                  placeholder="+ день"
                  placement="bottomLeft"
                  allowClear={false}
                  autoFocus
                  onChange={(value) => {
                    handleDateChange(value);
                    setPickerKey((k) => k + 1);
                  }}
                  disabled={newRow?.date.length >= 7}
                  defaultPickerValue={pickerValue}
                  onPanelChange={(value) => setPickerValue(value)}
                />

                <Button
                  onClick={() => addRow()}
                  disabled={newRow.date.length === 0}
                  size="small"
                >
                  Сохранить
                </Button>
              </Flex>

              <Space wrap>
                {newRow.date.map((day) => (
                  <Tag key={day} closable onClose={() => removeDate(day)}>
                    {day}
                  </Tag>
                ))}
              </Space>

              <Typography.Text strong>Удалить неделю</Typography.Text>

              <Flex vertical style={{ width: "100%" }} gap={5}>
                {getWeeksForDelete?.data.map((week, index) => (
                  <Flex key={week._id} vertical>
                    {index > 0 && <Divider style={{ margin: "5px 0" }} />}

                    <Flex align="center" justify="space-between">
                      <Typography.Text style={{ maxWidth: "85%" }}>
                        <CalendarOutlined /> Неделя: {week.date.join(", ")}
                      </Typography.Text>

                      <Popconfirm
                        title={`Удалить неделю ${week.date.join(", ")}?`}
                        okText="Удалить"
                        description="Неделя будет удалена безвозвратно!"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => deleteRow(week?._id)}
                      >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          }
        >
          <Button
            icon={<UnorderedListOutlined />}
            size="small"
            disabled={!months?.length}
          />
        </Popover>

        {/* месяцы */}
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (isOpen) {
              setMonthName("");
              setMonthSearch("");

              const month = months?.find(
                (month) => month._id === selectedMonthId,
              );

              setNewMonthName(month?.month ?? "");
            }
          }}
          trigger="click"
          styles={{ root: { position: "fixed" } }}
          content={
            <Flex vertical gap={10}>
              <Typography.Text strong>Создать месяц</Typography.Text>

              <Flex gap={10} style={{ width: 300 }}>
                <Input
                  size="small"
                  placeholder="Имя месяца:"
                  maxLength={25}
                  showCount
                  style={{ flex: 1 }}
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  onPressEnter={async () => {
                    if (!monthName.trim()) return;

                    await createMonth(monthName);
                    setNewRow((prev) => ({ ...prev, date: [] }));
                    setOpen(false);
                  }}
                />

                <Button
                  size="small"
                  type="primary"
                  disabled={!monthName.trim()}
                  onClick={async () => {
                    await createMonth(monthName);
                    setNewRow((prev) => ({ ...prev, date: [] }));
                    setOpen(false);
                  }}
                >
                  Создать
                </Button>
              </Flex>

              <Typography.Text strong>Редактировать имя месяца</Typography.Text>

              <Flex gap={10} style={{ width: 300 }}>
                <Input
                  size="small"
                  placeholder="Новое имя месяца:"
                  maxLength={25}
                  showCount
                  style={{ flex: 1 }}
                  value={newMonthName}
                  onChange={(e) => setNewMonthName(e.target.value)}
                  onPressEnter={async () => {
                    if (!selectedMonthId || !newMonthName.trim()) return;

                    await updateMonth(selectedMonthId, newMonthName);
                    setOpen(false);
                  }}
                />

                <Button
                  size="small"
                  disabled={!newMonthName.trim()}
                  onClick={async () => {
                    if (!selectedMonthId || !newMonthName.trim()) return;

                    await updateMonth(selectedMonthId, newMonthName);
                    setOpen(false);
                  }}
                >
                  Сохранить
                </Button>
              </Flex>

              <Typography.Text strong>Удалить месяц</Typography.Text>

              <Input
                size="small"
                placeholder="Поиск месяца:"
                allowClear
                value={monthSearch}
                onChange={(e) => setMonthSearch(e.target.value)}
              />

              <Flex
                vertical
                style={{
                  maxHeight: 175,
                  overflowY: "auto",
                }}
                gap={5}
              >
                {filteredMonths?.map((month, index) => (
                  <Flex key={month._id} vertical>
                    {index > 0 && <Divider style={{ margin: "5px 0" }} />}

                    <Flex
                      align="center"
                      justify="space-between"
                      style={{ width: "100%" }}
                    >
                      <Typography.Text
                        style={{ maxWidth: 260, wordBreak: "break-word" }}
                      >
                        <CalendarOutlined /> месяц: {month.month}
                      </Typography.Text>

                      <Popconfirm
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        title={`Удалить месяц «${month.month}»?`}
                        description="Mесяц будет удален безвозвратно!"
                        okText="Удалить"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => {
                          deleteMonth(month._id);
                          setOpen(false);
                        }}
                      >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          }
        >
          <Button icon={<CalendarOutlined />} size="small" />
        </Popover>

        {/* итоги */}
        <Popover
          trigger="click"
          styles={{ root: { position: "fixed" } }}
          content={
            <Flex vertical gap={5} style={{ minWidth: 200 }}>
              <Typography.Text strong>Итоги месяца</Typography.Text>

              <Divider style={{ margin: "5px 0" }} />

              {/* Дней +  Коментов*/}
              <>
                <TotalRow label="Дней" value={String(totalsMonth.days)} />

                <TotalRow
                  label="Коментов"
                  value={String(totalsMonth.comments)}
                />
              </>

              <Divider style={{ margin: "5px 0" }} />

              {/* Зп + Траты + Итого */}
              <>
                <TotalRow
                  label="Зп"
                  value={`${totalsMonth.salary.toLocaleString("ru-RU")} ₽`}
                />

                <TotalRow
                  label="Траты"
                  value={`${totalsMonth.expenses.toLocaleString("ru-RU")} ₽`}
                />

                <TotalRow
                  label="Итого"
                  value={`${(totalsMonth.salary + totalsMonth.expenses).toLocaleString("ru-RU")} ₽`}
                  strong
                />
              </>

              <Divider style={{ margin: "5px 0" }} />

              {/* Инкас +  Заплатили + Итого */}
              <>
                <TotalRow
                  label="Инкас"
                  value={`${totalsMonth.cashCollection.toLocaleString("ru-RU")} ₽`}
                />

                <TotalRow
                  label="Заплатили"
                  value={`${totalsMonth.paid.toLocaleString("ru-RU")} ₽`}
                />

                <TotalRow
                  label="Итого"
                  value={`${(totalsMonth.cashCollection + totalsMonth.paid).toLocaleString("ru-RU")} ₽`}
                  strong
                />
              </>

              <Divider style={{ margin: "5px 0" }} />

              <TotalRow
                label="Осталось"
                value={`${(totalsMonth.salary + totalsMonth.expenses - (totalsMonth.cashCollection + totalsMonth.paid)).toLocaleString("ru-RU")} ₽`}
                strong
              />
            </Flex>
          }
        >
          <Button
            icon={<BarChartOutlined />}
            size="small"
            disabled={!months?.length}
          />
        </Popover>
      </Flex>
    </Flex>
  );
};

export default CoffeeControls;
