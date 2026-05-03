"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const regionGroups = {
  "서울특별시": [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", 
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", 
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
  ],
  "경기도": [
    "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", 
    "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", 
    "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", 
    "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"
  ],
  "기타": ["인천광역시", "부산광역시", "대구광역시", "대전광역시", "광주광역시", "울산광역시", "세종특별자치시"]
};

interface RegionSelectorProps {
  selectedRegions: string[];
  onSelectedRegionsChange: (regions: string[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RegionSelector({ 
  selectedRegions, 
  onSelectedRegionsChange,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: RegionSelectorProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const toggleRegion = (value: string) => {
    const updated = selectedRegions.includes(value)
      ? selectedRegions.filter((item) => item !== value)
      : [...selectedRegions, value];
    onSelectedRegionsChange(updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        <Search className="mr-2 h-4 w-4" />
        지역 설정 ({selectedRegions.length})
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>관심 지역 설정</DialogTitle>
          <DialogDescription>
            알림을 받고 싶은 구(서울) 또는 시(경기)를 선택하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 min-h-[40px] max-h-[120px] overflow-y-auto p-2 border rounded-md bg-slate-50/50">
            {selectedRegions.length > 0 ? (
              selectedRegions.map((val) => (
                <Badge key={val} variant="secondary" className="gap-1">
                  {val.split(" ")[1] || val}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => toggleRegion(val)}
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground p-1">선택된 지역이 없습니다.</span>
            )}
          </div>
          <Command className="border rounded-md">
            <CommandInput placeholder="지역 검색 (예: 강남구, 성남시)..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              {Object.entries(regionGroups).map(([group, names]) => (
                <CommandGroup key={group} heading={group}>
                  {names.map((name) => {
                    const value = `${group} ${name}`;
                    return (
                      <CommandItem
                        key={value}
                        value={value}
                        onSelect={() => toggleRegion(value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRegions.includes(value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={() => setOpen(false)}>저장하기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
